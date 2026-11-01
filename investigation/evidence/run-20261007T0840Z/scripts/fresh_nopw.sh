#!/bin/bash
# kill browser, fresh profile, relaunch, login
cd /tmp/w; pkill -f "[c]hrome-linux/chrome"; sleep 2; rm -rf /tmp/w/prof; mkdir -p /tmp/w/prof/Default; echo "{\"credentials_enable_service\":false,\"profile\":{\"password_manager_enabled\":false}}" > /tmp/w/prof/Default/Preferences
pgrep Xvfb >/dev/null || (Xvfb :99 -screen 0 1440x900x24 >/dev/null 2>&1 &); sleep 1
DISPLAY=:99 nohup /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --remote-debugging-port=9222 --user-data-dir=/tmp/w/prof --window-size=1440,900 --no-first-run about:blank >/tmp/w/chrome.log 2>&1 &
sleep 5
export NODE_PATH=$(npm root -g)
node login.js >/dev/null && node login2.js && sleep 8 && echo "LOGIN_DONE $(date -u +%FT%TZ)"
