#!/usr/bin/env dash

# why dash vs bash? because we aren't fancy that's why.
# true shell scripting---
# no bashisms here.

# Get the current script path (like __dirname in Node.js).
# tons of ways to do this. liked this one because it's POSIX
SCRIPT_PATH=$(dirname "$0")
SCRIPT_PATH=$(eval "cd \"$SCRIPT_PATH\" && pwd")

# the directory our results will live in (first cli argument)
BUILD_DIR="$1"

if [ -z "${BUILD_DIR}" ]; then
    echo "missing build directory (first argument)" >&2 # redirect to stderr
    exit 1
fi

cleanup() {
    # clean up any previous builds if they exist
    [ -d $BUILD_DIR ] && {
        echo "cleaning up previous build directory"
        rm -r $BUILD_DIR
    }
}

build_react_ui() {
    # using "(" and ")" creates a subshell where you can do things
    # like `cd` and when you exit the subshell, the cwd is reset to
    # what it was previously among other things!
    (
        cd "${SCRIPT_PATH}/../packages/react-ui"
        npm run build || {
            cleanup
            echo "react-ui build failed lol" >&2
            exit 1
        }
    )
}

build_web_server() {
    (
        cd "${SCRIPT_PATH}/../packages/web-server"
    )
}

build_barbot_api() {
    (
        cd "${SCRIPT_PATH}/../packages/barbot-api"
    )
}

build() {
    mkdir $BUILD_DIR # create the top-level build directory

    (
        cd "${SCRIPT_PATH}/.."
        npx lerna bootstrap
    )

    echo "building react-ui..."

    # build the client code & transfer build to our top-level build dir
    build_react_ui || exit 1
    mkdir "${BUILD_DIR}/react-ui"
    mv "${SCRIPT_PATH}/../packages/react-ui/build"/* "${BUILD_DIR}/react-ui"

    echo "building web-server..."

    # copy the web-server code (incl. node_modules) to $BUILD_DIR/web-server
    build_web_server
    cp -r "${SCRIPT_PATH}/../packages/web-server" $BUILD_DIR

    echo "building barbot-api..."

    # copy the barbot-api code (incl. node_modules) to $BUILD_DIR/barbot-api
    build_barbot_api
    cp -r "${SCRIPT_PATH}/../packages/barbot-api" $BUILD_DIR
}


cleanup # cleanup the current directory before building. see function below
build   # see build fn below.
