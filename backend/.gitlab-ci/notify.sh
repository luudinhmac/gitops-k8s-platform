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

# Calculate Job and Pipeline Durations
JOB_DURATION_TEXT="N/A"
if [ -n "$CI_JOB_STARTED_AT" ]; then
    START_EPOCH=$(date -d "${CI_JOB_STARTED_AT}" +%s 2>/dev/null)
    if [ -z "$START_EPOCH" ]; then
        CLEANED_DATE=$(echo "$CI_JOB_STARTED_AT" | sed 's/Z//' | sed 's/T/ /')
        START_EPOCH=$(date -d "$CLEANED_DATE" +%s 2>/dev/null)
    fi
    if [ -n "$START_EPOCH" ]; then
        END_EPOCH=$(date +%s)
        DURATION_SECONDS=$((END_EPOCH - START_EPOCH))
        if [ $DURATION_SECONDS -ge 3600 ]; then
            JOB_DURATION_TEXT="$((DURATION_SECONDS / 3600))h $(((DURATION_SECONDS % 3600) / 60))m $((DURATION_SECONDS % 60))s"
        elif [ $DURATION_SECONDS -ge 60 ]; then
            JOB_DURATION_TEXT="$((DURATION_SECONDS / 60))m $((DURATION_SECONDS % 60))s"
        else
            JOB_DURATION_TEXT="${DURATION_SECONDS}s"
        fi
    fi
fi

PIPELINE_DURATION_TEXT="N/A"
if [ -n "$CI_PIPELINE_CREATED_AT" ]; then
    PIPE_START_EPOCH=$(date -d "${CI_PIPELINE_CREATED_AT}" +%s 2>/dev/null)
    if [ -z "$PIPE_START_EPOCH" ]; then
        CLEANED_DATE=$(echo "$CI_PIPELINE_CREATED_AT" | sed 's/Z//' | sed 's/T/ /')
        PIPE_START_EPOCH=$(date -d "$CLEANED_DATE" +%s 2>/dev/null)
    fi
    if [ -n "$PIPE_START_EPOCH" ]; then
        END_EPOCH=$(date +%s)
        DURATION_SECONDS=$((END_EPOCH - PIPE_START_EPOCH))
        if [ $DURATION_SECONDS -ge 3600 ]; then
            PIPELINE_DURATION_TEXT="$((DURATION_SECONDS / 3600))h $(((DURATION_SECONDS % 3600) / 60))m $((DURATION_SECONDS % 60))s"
        elif [ $DURATION_SECONDS -ge 60 ]; then
            PIPELINE_DURATION_TEXT="$((DURATION_SECONDS / 60))m $((DURATION_SECONDS % 60))s"
        else
            PIPELINE_DURATION_TEXT="${DURATION_SECONDS}s"
        fi
    fi
fi

# If successful, only send notification for deployment, post-deployment, or rollback stages
if [ "$STATUS" = "success" ] || [ "$STATUS" = "successful" ]; then
    if [ "$TYPE" != "deploy" ] && [ "$TYPE" != "post-deploy" ] && [ "$TYPE" != "rollback" ]; then
        echo "Job succeeded in stage '$TYPE'. Skipping notification."
        exit 0
    fi
fi

# Fetch job log if failed/canceled and no log file provided or exists
if { [ "$STATUS" = "failed" ] || [ "$STATUS" = "canceled" ]; } && ( [ -z "$LOG_FILE" ] || [ ! -f "$LOG_FILE" ] ); then
    if [ ! -z "$CI_JOB_TOKEN" ] && [ ! -z "$CI_JOB_ID" ]; then
        echo "Job failed/canceled. Fetching job log from GitLab API..."
        curl -s --header "JOB-TOKEN: ${CI_JOB_TOKEN}" "${CI_API_V4_URL:-https://gitlab.com/api/v4}/projects/${CI_PROJECT_ID}/jobs/${CI_JOB_ID}/trace" -o job.log
        LOG_FILE="job.log"
    fi
fi

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
if [ "$STATUS" = "failed" ]; then
    ICON="❌"
    STATUS_TEXT="THẤT BẠI"
elif [ "$STATUS" = "canceled" ]; then
    ICON="⚠️"
    STATUS_TEXT="BỊ HỦY"
fi

# Telegram Notification
TELEGRAM_MSG="<b>${ICON} CI/CD PIPELINE ${STATUS_TEXT}</b>%0A%0A👤 <b>Người thực hiện:</b> ${ESC_USER_NAME}%0A📁 <b>Dự án:</b> ${PROJECT_NAME}%0A🛠 <b>Tiến trình:</b> ${TYPE} (${JOB_NAME})%0A⏱ <b>Thời gian Job:</b> ${JOB_DURATION_TEXT}%0A⏱ <b>Thời gian Pipeline:</b> ${PIPELINE_DURATION_TEXT}%0A📝 <b>Commit:</b> ${ESC_COMMIT_MSG}%0A🔗 <b>Chi tiết:</b> <a href='${PIPELINE_URL}'>Xem Pipeline</a>"

if { [ "$STATUS" = "failed" ] || [ "$STATUS" = "canceled" ]; } && [ -f "$LOG_FILE" ]; then
    LOG_TAIL=$(tail -n 15 "$LOG_FILE" | sed "s/$(printf '\033')\[[0-9;]*[a-zA-Z]//g" | sed 's/<[^>]*>//g' | sed 's/&/\&amp;/g' | sed 's/</\&lt;/g' | sed 's/>/\&gt;/g')
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
    if { [ "$STATUS" = "failed" ] || [ "$STATUS" = "canceled" ]; } && [ -f "$LOG_FILE" ]; then
        LOG_TAIL=$(tail -n 15 "$LOG_FILE" | sed "s/$(printf '\033')\[[0-9;]*[a-zA-Z]//g" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr -d '\n' | tr -d '\r')
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
                            { "title": "Thời gian Job:", "value": "${JOB_DURATION_TEXT}" },
                            { "title": "Thời gian Pipeline:", "value": "${PIPELINE_DURATION_TEXT}" },
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
