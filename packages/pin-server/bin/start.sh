#!/usr/bin/env dash

SCRIPT_PATH=`dirname "$0"`; SCRIPT_PATH=`eval "cd \"$SCRIPT_PATH\" && pwd"`

ROOT="${SCRIPT_PATH}/../"

cd $ROOT

virtualenv env
./env/bin/pip3 install -r requirements.txt
./env/bin/python3 server.py
