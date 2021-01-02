#!/usr/bin/env dash

SCRIPT_PATH=$(dirname "$0")
SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")

if [ -z "${BUILD_DIR}" ]; then
    echo "missing BUILD_DIR environment variable" >&2 # redirect to stderr
    exit 1
fi

cd "${SCRIPT_PATH}/.."

./node_modules/.bin/react-scripts build || {
    cleanup
    echo "react-ui build failed lol" >&2
    exit 1
}

rm -rf "${BUILD_DIR}/react-ui"
mkdir "${BUILD_DIR}/react-ui"

mv ./build/* "${BUILD_DIR}/react-ui"
