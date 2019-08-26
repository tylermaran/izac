#!/usr/bin/env dash

export PIN_SERVER_PORT=5000
export WEB_SERVER_PORT=8000

lerna run --parallel start
