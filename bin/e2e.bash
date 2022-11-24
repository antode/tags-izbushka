#!/usr/bin/env bash

set -Eeuo pipefail;

docker-compose up --detach;

docker-compose exec node npx playwright test
