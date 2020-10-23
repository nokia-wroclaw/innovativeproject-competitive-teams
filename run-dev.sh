#!/bin/sh

# Stop when one of the servers exits with a non-zero exit code
set -e

FRONTEND_PREFIX="\033[38;5;154m FRONTEND_|\033[0m"
BACKEND_PREFIX="\033[38;5;27m BACKEND__|\033[0m"

# Frontend
export REACT_APP_BACKEND_URL=http://localhost:8000/api
npm start --prefix frontend 2>&1 | awk '{ print pfx, $0}' pfx="$FRONTEND_PREFIX" &

# Backend
source ./backend/env/bin/activate
export DATABASE_URL=postgresql://postgres:@localhost/ctdb
uvicorn --use-colors --app-dir backend --host 127.0.0.1 app.main:app --reload 2>&1 | awk '{ print pfx, $0}' pfx="$BACKEND_PREFIX"

# Kill the background jobs on exit
trap "trap - SIGTERM && kill $(jobs -p)" SIGINT SIGTERM EXIT

