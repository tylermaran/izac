#!/usr/bin/env dash

SCRIPT_PATH=$(dirname "$0")
SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")

if [ -z "${BUILD_DIR}" ]; then
    echo "missing BUILD_DIR environment variable" >&2 # redirect to stderr
    exit 1
fi

cd "${SCRIPT_PATH}/.."

rm -rf $BUILD_DIR/web-server
mkdir $BUILD_DIR/web-server
cp -r ./* $BUILD_DIR/web-server
