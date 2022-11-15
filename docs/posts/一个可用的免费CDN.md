---
title: 一个可用的免费CDN
date: 2020-11-17 10:26:32
tag: ["工具"]
category: ["工具"]
---

## 免费 CDN

找到了一个好用的 cdn，mark 一下

github 资源在国内加载速度较慢，因此需要使用 CDN 提高速度。JSDelivr + Github 就可以提供非常好用的 CDN 服务。

对于个人来说，可以将图片存在 github 上;通过 cdn 访问链接，实际上达到了 oss 的效果。

## 具体使用

准备一个 GitHub 仓库，将图片上传至这个仓库。

cdn 的路径为
`https://cdn.jsdelivr.net/gh/${你的用户名}/${你的仓库名}@${分支或版本}/文件路径`

## 例子

`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io@master/images/avatar.gif`
或
`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io/images/avatar.gif`

**如果分支为 master，那么可以只需仓库名即可。**
