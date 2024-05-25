#!/bin/bash

npx pnpm i --store=node_modules/.pnpm-store
sed -i 's/\/vuepress-blog\//\//g' docs/.vuepress/components/constants/constants.ts
cd ./docs/.vuepress/realcugan-ncnn-webassembly
bash build.sh
npx pnpm docs:build
