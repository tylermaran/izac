#!/usr/bin/env dash

BUILD_DIR="$1"; BUILD_DIR=$(eval "cd \"$BUILD_DIR\" && pwd")
cd "${BUILD_DIR}/pin-server"
./env/bin/python3 server.py
