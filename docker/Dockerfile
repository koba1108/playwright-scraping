FROM mcr.microsoft.com/playwright

COPY . /usr/src/app

WORKDIR /usr/src/app

# 日本語対応
RUN apt-get update && \
    apt-get -y install locales fonts-ipafont fonts-ipaexfont && \
    echo "ja_JP UTF-8" > /etc/locale.gen && locale-gen && \
    npm install -g npm@latest

# playwrightインストール
RUN yarn install --frozen-lockfile && \
    yarn build

# script実行
ENTRYPOINT [ "node", "./dist/main.js" ]
