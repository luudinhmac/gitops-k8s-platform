#!/bin/sh
set -e

URL=$1
ENV=$2

echo "========================================================="
echo "STARTING FRONTEND SMOKE TEST FOR ENV: $ENV ON URL: $URL"
echo "========================================================="

# 1. Homepage check
echo "Step 1: Checking frontend homepage..."
HTTP_STATUS=$(curl -s -L -o homepage.html -w "%{http_code}" "$URL")
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo "❌ Homepage failed with status: $HTTP_STATUS"
    exit 1
fi
echo "✅ Homepage responded with 200 OK!"

# 2. Verify homepage does not contain server/render errors
if grep -iq "Internal Server Error" homepage.html || grep -iq "Application error: a client-side exception has occurred" homepage.html; then
    echo "❌ Homepage contains server error or client-side exception message!"
    exit 1
fi
echo "✅ Homepage content verified (no generic crash screens detected)."

echo "========================================================="
echo "🎉 ALL FRONTEND SMOKE TESTS PASSED SUCCESSFULLY!"
echo "========================================================="
