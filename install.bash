#!/usr/bin/env bash

docker run --rm -it -v $(pwd):/app -v ~/:/home/node -u 1000 -w /app node:16 npm i

docker run --rm -it -v $(pwd):/app -v ~/:/home/node -u 1000 -w /app node:16 npm run build
