#!/usr/bin/env dash

SCRIPT_PATH=$(dirname "$0"); SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")
BUILD_DIR="$1"; BUILD_DIR=$(eval "cd \"$BUILD_DIR\" && pwd")

export NODE_ENV=production;
export WEB_SERVER_PORT=5000;
export PIN_SERVER_PORT=5001;
export REACT_BUILD_DIR="${BUILD_DIR}/react-ui"

"${SCRIPT_PATH}/start_web_server.sh" $BUILD_DIR &
WEB_SERVER_ID=$!

"${SCRIPT_PATH}/start_pin_server.sh" $BUILD_DIR &
PIN_SERVER_ID=$!

echo "-----------------------------------------"
echo "web server PID" $WEB_SERVER_ID
echo "pin server PID" $PIN_SERVER_ID
echo "-----------------------------------------"

cleanup() {
    PID=$(lsof -i":${PIN_SERVER_PORT}" | awk '{print $2}' | tail -1)
    if [ -n "${PID}" ]; then
        kill $PID
    fi

    PID=$(lsof -i":${WEB_SERVER_PORT}" | awk '{print $2}' | tail -1)
    if [ -n "${PID}" ]; then
        kill $PID
    fi
}

trap cleanup EXIT
trap cleanup INT

wait $PIN_SERVER_ID
wait $WEB_SERVER_ID
