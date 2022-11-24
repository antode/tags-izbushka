#!/usr/bin/env bash

set -Eeuo pipefail;

WORKING_DIR="$(pwd)";

[ ! -f "${WORKING_DIR}/.env" ] && cp "${WORKING_DIR}/docker/.env.dist" "${WORKING_DIR}/.env";

docker-compose build --pull

"$WORKING_DIR/bin/run.bash" npm install --no-scripts --no-audit;
"$WORKING_DIR/bin/run.bash" npx playwright install;
