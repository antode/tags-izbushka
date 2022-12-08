#!/usr/bin/env bash

set -Eeuo pipefail;

COMPOSE="${1}"

${COMPOSE} run --rm node "$@";
