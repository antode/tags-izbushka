#!/usr/bin/env bash

set -Eeuo pipefail;

docker-compose up --detach --build --force-recreate --remove-orphans;
