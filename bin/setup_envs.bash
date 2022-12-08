#!/usr/bin/env bash

set -Eeuo pipefail;

WORKING_DIR="${1}";
DOCKER_COMPOSE_DIR="${2}";

if [ -f "${WORKING_DIR}/.env" ]; then
    exit 0;
fi

cp "${DOCKER_COMPOSE_DIR}/.env.dist" "${WORKING_DIR}/.env";

echo "USER_ID=$(id -u)" >> "${WORKING_DIR}/.env";
