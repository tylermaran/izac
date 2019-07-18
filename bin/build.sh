#!/bin/sh

# why sh vs bash? because we aren't fancy that's why.
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

function cleanup() {
    # clean up any previous builds if they exist
    [ -d $BUILD_DIR ] && {
        echo "cleaning up previous build directory"
        rm -r $BUILD_DIR
    }
}

function build_client() {
    # using "(" and ")" creates a subshell where you can do things
    # like `cd` and when you exit the subshell, the cwd is reset to
    # what it was previously among other things!
    (
        cd "${SCRIPT_PATH}/../packages/client"
        npm install
        npm run build || {
            cleanup
            echo "client build failed lol" >&2
            exit 1
        }
    )
}

function build_server() {
    (
        cd "${SCRIPT_PATH}/../packages/server"
        npm install
    )
}

function build() {
    mkdir $BUILD_DIR # create the top-level build directory

    # build the client code & transfer build to our top-level build dir
    build_client || exit 1
    mkdir "${BUILD_DIR}/client"
    mv "${SCRIPT_PATH}/../packages/client/build"/* "${BUILD_DIR}/client"

    # copy the server code (incl. node_modules) to $BUILD_DIR/server
    build_server
    cp -r "${SCRIPT_PATH}/../packages/server" $BUILD_DIR
}


cleanup # cleanup the current directory before building. see function below
build   # see build fn below.
