#!/bin/bash

# Configuration (passed from GitLab CI Variables)
# TELEGRAM_BOT_TOKEN
# TELEGRAM_CHAT_ID
# TEAMS_WEBHOOK_URL

STATUS=$1 # success | failed
MESSAGE_TYPE=$2 # build | deploy | migrate
LOG_FILE=$3 # optional path to log file

# GitLab CI Environment Variables
USER_NAME=${GITLAB_USER_NAME:-"Unknown"}
PROJECT_NAME=${CI_PROJECT_NAME:-"Portfolio"}
JOB_NAME=${CI_JOB_NAME:-"Job"}
PIPELINE_URL=${CI_PIPELINE_URL}
COMMIT_MSG=${CI_COMMIT_MESSAGE:-"No message"}

ICON="✅"
STATUS_TEXT="THÀNH CÔNG"
if [ "$STATUS" == "failed" ]; then
    ICON="❌"
    STATUS_TEXT="THẤT BẠI"
fi

# Format message for Telegram (HTML)
TELEGRAM_MSG="<b>${ICON} CI/CD PIPELINE ${STATUS_TEXT}</b>

👤 <b>Người thực hiện:</b> ${USER_NAME}
📁 <b>Dự án:</b> ${PROJECT_NAME}
🛠 <b>Tiến trình:</b> ${MESSAGE_TYPE} (${JOB_NAME})
📝 <b>Commit:</b> ${COMMIT_MSG}
🔗 <b>Chi tiết:</b> <a href='${PIPELINE_URL}'>Xem Pipeline</a>"

# If failed and log exists, append last 10 lines
if [ "$STATUS" == "failed" ] && [ -f "$LOG_FILE" ]; then
    LOG_TAIL=$(tail -n 15 "$LOG_FILE" | sed 's/<[^>]*>//g') # Remove HTML-like tags from log
    TELEGRAM_MSG="${TELEGRAM_MSG}

📑 <b>Log lỗi:</b>
<code>${LOG_TAIL}</code>"
fi

# Send to Telegram
if [ ! -z "$TELEGRAM_BOT_TOKEN" ] && [ ! -z "$TELEGRAM_CHAT_ID" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d chat_id="${TELEGRAM_CHAT_ID}" \
        -d parse_mode="HTML" \
        -d text="${TELEGRAM_MSG}" > /dev/null
fi

# Send to MS Teams (Markdown)
if [ ! -z "$TEAMS_WEBHOOK_URL" ]; then
    TEAMS_MSG="${ICON} **CI/CD PIPELINE ${STATUS_TEXT}**\n\n"
    TEAMS_MSG="${TEAMS_MSG}* **Người thực hiện:** ${USER_NAME}\n"
    TEAMS_MSG="${TEAMS_MSG}* **Dự án:** ${PROJECT_NAME}\n"
    TEAMS_MSG="${TEAMS_MSG}* **Tiến trình:** ${MESSAGE_TYPE} (${JOB_NAME})\n"
    TEAMS_MSG="${TEAMS_MSG}* **Commit:** ${COMMIT_MSG}\n"
    TEAMS_MSG="${TEAMS_MSG}* **Chi tiết:** [Xem Pipeline](${PIPELINE_URL})"
    
    if [ "$STATUS" == "failed" ] && [ -f "$LOG_FILE" ]; then
        LOG_TAIL=$(tail -n 15 "$LOG_FILE")
        TEAMS_MSG="${TEAMS_MSG}\n\n**Log lỗi:**\n\`\`\`\n${LOG_TAIL}\n\`\`\`"
    fi

    curl -H "Content-Type: application/json" -d "{'text': '${TEAMS_MSG}'}" "${TEAMS_WEBHOOK_URL}" > /dev/null
fi
