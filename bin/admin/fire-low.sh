#!/usr/bin/env dash

if [ "$#" -ne 2 ]
then
  echo "fire-low.sh <pin-number> <duration-ms>"
  exit 1
fi

PIN="${1}"
DURATION_MS="${2}"
WEB_SERVER_PORT=5000

curl -XPOST "localhost:${WEB_SERVER_PORT}/admin/pins/${PIN}/fire" \
     -H 'Content-Type: application/json' \
     -d "{ \"output\": 0, \"sleep_ms\": ${DURATION_MS} }"
