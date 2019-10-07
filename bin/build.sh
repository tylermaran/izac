#!/usr/bin/env dash

# why dash vs bash? because we aren't fancy that's why.

# Get the current script path (like __dirname in Node.js).
# tons of ways to do this. liked this one because it's POSIX
SCRIPT_PATH=$(dirname "$0")
SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")

if [ -z "${BUILD_DIR}" ]; then
    echo "missing BUILD_DIR environment variable" >&2 # redirect to stderr
    exit 1
fi

cleanup() {
    # clean up any previous builds if they exist
    [ -d $BUILD_DIR ] && {
        echo "cleaning up previous build directory"
        rm -r $BUILD_DIR
    }
}

# the directory our results will live in (first cli argument)
BUILD_DIR="$1"
cleanup
mkdir -p $BUILD_DIR # create the top-level build directoryv en
BUILD_DIR=$(eval "cd \"$BUILD_DIR\" && pwd")

build_react_ui() {
}

build_web_server() {
}

build_barbot_api() {
    (
        cd "${SCRIPT_PATH}/../packages/barbot-api"
        mkdir "${BUILD_DIR}/barbot-api"
        cp -r ./* "${BUILD_DIR}/barbot-api"
    )
}

build_pin_server() {
    (
        cd "${SCRIPT_PATH}/../packages/pin-server"

        virtualenv env
        ./env/bin/pip3 install -r requirements.txt
        mkdir $BUILD_DIR/pin-server
        cp -r ./* $BUILD_DIR/pin-server
    )
}

build() {
    (
        cd "${SCRIPT_PATH}/.."
        npx lerna bootstrap
    )

    echo ""
    echo ".-+=:/|>---------------------<|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|> building barbot-api <|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|>---------------------<|\:=+-."
    build_barbot_api || exit 1

    echo ""
    echo ".-+=:/|>---------------------<|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|> building web-server <|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|>---------------------<|\:=+-."
    build_web_server || exit 1

    echo ""
    echo ".-+=:/|>---------------------<|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|> building pin-server <|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|>---------------------<|\:=+-."
    build_pin_server || exit 1

    echo ""
    echo ".-+=:/|>---------------------<|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|> building react-ui   <|\:=+-."
    echo ".-+=:/|>                     <|\:=+-."
    echo ".-+=:/|>---------------------<|\:=+-."
    build_react_ui || exit 1
}

build   # see build fn below.
