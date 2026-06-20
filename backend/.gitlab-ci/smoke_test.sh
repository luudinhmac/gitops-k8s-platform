#!/bin/sh
set -e

URL=$1
ENV=$2

echo "========================================================="
echo "STARTING SMOKE TEST FOR ENV: $ENV ON URL: $URL"
echo "========================================================="

# 1. Health check
echo "Step 1: Checking health endpoint..."
HEALTH_RESP=$(curl -s "${URL}/api/v1/health")
echo "Health Response: $HEALTH_RESP"
STATUS=$(echo "$HEALTH_RESP" | jq -r '.status' 2>/dev/null || true)
DATABASE=$(echo "$HEALTH_RESP" | jq -r '.database' 2>/dev/null || true)

if [ "$STATUS" != "ok" ] || [ "$DATABASE" != "connected" ]; then
    echo "❌ Health check failed!"
    exit 1
fi
echo "✅ Health check passed!"

# 2. Get Public Core Endpoint (Categories)
echo "Step 2: Checking public categories endpoint..."
CATEGORIES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${URL}/api/v1/categories")
if [ "$CATEGORIES_STATUS" -ne 200 ]; then
    echo "❌ Failed to fetch categories. Status code: $CATEGORIES_STATUS"
    exit 1
fi
echo "✅ Public categories endpoint passed!"

# 3. Check Authenticated Endpoint without Token (should be 401)
echo "Step 3: Checking profile endpoint without authorization header..."
PROFILE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${URL}/api/v1/auth/profile")
if [ "$PROFILE_STATUS" -ne 401 ]; then
    echo "❌ Expected 401 Unauthorized for unauthenticated profile access, but got: $PROFILE_STATUS"
    exit 1
fi
echo "✅ Unauthenticated access check passed!"

# 4. Staging-only Login & Write Flow (to prevent database pollution in production)
if [ "$ENV" = "staging" ]; then
    RANDOM_ID=$(date +%s)
    TEST_USER="smoke_${RANDOM_ID}"
    TEST_EMAIL="smoke_${RANDOM_ID}@example.com"
    TEST_PASS="TestPass123"

    echo "Step 4: [Staging-only] Registering test user: $TEST_USER"
    REG_RESP=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"$TEST_USER\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}" \
      "${URL}/api/v1/auth/register")
      
    REG_USER=$(echo "$REG_RESP" | jq -r '.username' 2>/dev/null || true)
    if [ "$REG_USER" != "$TEST_USER" ]; then
        echo "❌ Registration failed! Response: $REG_RESP"
        exit 1
    fi
    echo "✅ Registration successful!"

    echo "Step 5: [Staging-only] Logging in test user..."
    LOGIN_RESP=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}" \
      "${URL}/api/v1/auth/login")
      
    TOKEN=$(echo "$LOGIN_RESP" | jq -r '.token' 2>/dev/null || true)
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        echo "❌ Login failed! Response: $LOGIN_RESP"
        exit 1
    fi
    echo "✅ Login successful! Token acquired."

    echo "Step 6: [Staging-only] Fetching profile with token..."
    PROFILE_RESP=$(curl -s -X GET \
      -H "Authorization: Bearer $TOKEN" \
      "${URL}/api/v1/auth/profile")
      
    PROFILE_SUCCESS=$(echo "$PROFILE_RESP" | jq -r '.success' 2>/dev/null || true)
    PROFILE_USERNAME=$(echo "$PROFILE_RESP" | jq -r '.user.username' 2>/dev/null || true)
    
    if [ "$PROFILE_SUCCESS" != "true" ] || [ "$PROFILE_USERNAME" != "$TEST_USER" ]; then
        echo "❌ Authenticated profile fetch failed! Response: $PROFILE_RESP"
        exit 1
    fi
    echo "✅ Authenticated profile check passed!"
fi

echo "========================================================="
echo "🎉 ALL SMOKE TESTS PASSED SUCCESSFULLY!"
echo "========================================================="
