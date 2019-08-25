#!/usr/bin/env dash

SCRIPT_PATH=`dirname "$0"`; SCRIPT_PATH=`eval "cd \"$SCRIPT_PATH\" && pwd"`

FLASK_APP="${SCRIPT_PATH}/../server.py" python3 -m flask run
