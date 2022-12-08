FROM node:18

RUN apt-get update; \
    apt-get install -y \
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libdbus-1-3 \
        libatspi2.0-0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libxkbcommon0 \
        libasound2 \
        libgtk-3-0 \
        libasound2 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libxtst6 \
        libatk1.0-0 \
        libdbus-glib-1-2 \
        libdbus-1-3 \
        libx11-xcb1 \
        libxcursor1 \
        libxi6 \
        libsoup2.4-1 \
        libgstreamer1.0-0 \
        libgtk-3-0 \
        libegl1 \
        libopus0 \
        libopengl0 \
        libglx0 \
        libwoff1 \
        libharfbuzz-icu0 \
        libgstreamer-plugins-base1.0-0 \
        libgstreamer-gl1.0-0 \
        libenchant-2-2 \
        libsecret-1-0 \
        libhyphen0 \
        libxcomposite1 \
        libxdamage1 \
        libwayland-server0 \
        libwayland-egl1 \
        libwayland-client0 \
        libmanette-0.2-0 \
        libgbm1 \
        libdrm2 \
        libxkbcommon0 \
        libepoxy0 \
        libdbus-1-3 \
        libgles2 \
        gstreamer1.0-libav

ARG USER_ID
RUN userdel --force --remove node; \
    groupadd --gid "$USER_ID" dev; \
    useradd --uid "$USER_ID" --gid dev --shell /bin/bash --create-home dev; \
    mkdir -p /home/dev/.npm /home/dev/.cache /app; \
    chown -R dev:dev /home/dev/ /app;

USER dev
WORKDIR /app
