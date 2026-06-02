#!/bin/sh
export TZ='Asia/Ho_Chi_Minh'

STATUS=$1 
TYPE=$2 
LOG_FILE=$3 

USER_NAME=${GITLAB_USER_NAME:-"Unknown"}
PROJECT_NAME=${CI_PROJECT_NAME:-"Portfolio"}
JOB_NAME=${CI_JOB_NAME:-"Job"}
PIPELINE_URL=${CI_PIPELINE_URL}
COMMIT_MSG=${CI_COMMIT_MESSAGE:-"No message"}

# Auto-install curl if missing
if ! command -v curl >/dev/null 2>&1; then
    echo "Installing curl..."
    if command -v apk >/dev/null 2>&1; then apk add --no-cache curl >/dev/null 2>&1;
    elif command -v apt-get >/dev/null 2>&1; then apt-get update >/dev/null 2>&1 && apt-get install -y curl >/dev/null 2>&1;
    fi
fi

# Debugging
echo "--- Notification Debug ---"
echo "Project: $PROJECT_NAME, Job: $JOB_NAME, Status: $STATUS"
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then echo "⚠️ TELEGRAM_BOT_TOKEN is missing"; else echo "✅ TELEGRAM_BOT_TOKEN is set"; fi
if [ -z "$TELEGRAM_CHAT_ID" ]; then echo "⚠️ TELEGRAM_CHAT_ID is missing"; else echo "✅ TELEGRAM_CHAT_ID is set"; fi
if [ -z "$TEAMS_WEBHOOK_URL" ]; then echo "⚠️ TEAMS_WEBHOOK_URL is missing"; else echo "✅ TEAMS_WEBHOOK_URL is set"; fi
echo "--------------------------"

# Escape for JSON
ESC_COMMIT_MSG=$(echo "$COMMIT_MSG" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n' | tr -d '\r')
ESC_USER_NAME=$(echo "$USER_NAME" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')

ICON="✅"
STATUS_TEXT="THÀNH CÔNG"
if [ "$STATUS" == "failed" ]; then
    ICON="❌"
    STATUS_TEXT="THẤT BẠI"
fi

# Telegram Notification
TELEGRAM_MSG="<b>${ICON} CI/CD PIPELINE ${STATUS_TEXT}</b>%0A%0A👤 <b>Người thực hiện:</b> ${ESC_USER_NAME}%0A📁 <b>Dự án:</b> ${PROJECT_NAME}%0A🛠 <b>Tiến trình:</b> ${TYPE} (${JOB_NAME})%0A📝 <b>Commit:</b> ${ESC_COMMIT_MSG}%0A🔗 <b>Chi tiết:</b> <a href='${PIPELINE_URL}'>Xem Pipeline</a>"

if [ "$STATUS" == "failed" ] && [ -f "$LOG_FILE" ]; then
    LOG_TAIL=$(tail -n 10 "$LOG_FILE" | sed 's/<[^>]*>//g' | sed 's/&/\&amp;/g' | sed 's/</\&lt;/g' | sed 's/>/\&gt;/g')
    TELEGRAM_MSG="${TELEGRAM_MSG}%0A%0A📑 <b>Log lỗi:</b>%0A<code>${LOG_TAIL}</code>"
fi

if [ ! -z "$TELEGRAM_BOT_TOKEN" ] && [ ! -z "$TELEGRAM_CHAT_ID" ]; then
    echo "Sending to Telegram..."
    curl -i -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "parse_mode=HTML" \
        -d "text=${TELEGRAM_MSG}"
    echo ""
fi

# MS Teams Notification
if [ ! -z "$TEAMS_WEBHOOK_URL" ]; then
    echo "Sending to MS Teams (Adaptive Card)..."
    
    LOG_CONTENT=""
    if [ "$STATUS" == "failed" ] && [ -f "$LOG_FILE" ]; then
        LOG_TAIL=$(tail -n 10 "$LOG_FILE" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n' | tr -d '\r')
        LOG_CONTENT="**Log lỗi:**\n\n${LOG_TAIL}"
    fi

    PAYLOAD=$(cat <<EOF
{
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "body": [
                    {
                        "type": "TextBlock",
                        "size": "Medium",
                        "weight": "Bolder",
                        "text": "${ICON} CI/CD PIPELINE ${STATUS_TEXT}"
                    },
                    {
                        "type": "FactSet",
                        "facts": [
                            { "title": "Người thực hiện:", "value": "${ESC_USER_NAME}" },
                            { "title": "Dự án:", "value": "${PROJECT_NAME}" },
                            { "title": "Tiến trình:", "value": "${TYPE} (${JOB_NAME})" },
                            { "title": "Commit:", "value": "${ESC_COMMIT_MSG}" }
                        ]
                    },
                    {
                        "type": "TextBlock",
                        "text": "${LOG_CONTENT}",
                        "wrap": true,
                        "fontType": "Monospace",
                        "size": "Small"
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "Xem Pipeline",
                        "url": "${PIPELINE_URL}"
                    }
                ],
                "\$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.2"
            }
        }
    ]
}
EOF
)

    curl -i -H "Content-Type: application/json" -d "$PAYLOAD" "$TEAMS_WEBHOOK_URL"
    echo ""
fi
