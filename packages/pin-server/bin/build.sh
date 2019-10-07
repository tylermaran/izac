#!/usr/bin/env dash

SCRIPT_PATH=$(dirname "$0")
SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")

if [ -z "${BUILD_DIR}" ]; then
    echo "missing BUILD_DIR environment variable" >&2 # redirect to stderr
    exit 1
fi

cd "${SCRIPT_PATH}/.."

virtualenv env
./env/bin/pip3 install -r requirements.txt
rm -rf $BUILD_DIR/pin-server
mkdir $BUILD_DIR/pin-server
cp -r ./* $BUILD_DIR/pin-server
