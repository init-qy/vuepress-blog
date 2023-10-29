---
title: A free and available CDN.
date: 2020-11-17 10:26:32
tag:
  - tool
category:
  - tool
---

## Free CDN

Found a useful CDN, marking it down.

Loading GitHub resources in China is slow, so we need to use a CDN to improve the speed. JSDelivr + GitHub can provide a very useful CDN service.

For individuals, you can store images on GitHub; by accessing the link through the CDN, you actually achieve the effect of using an object storage service (OSS).

## How to Use

Prepare a GitHub repository and upload the images to this repository.

The CDN path is
`https://cdn.jsdelivr.net/gh/${your_username}/${your_repository_name}@${branch_or_version}/file_path`

## Example

`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io@master/images/avatar.gif`
or
`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io/images/avatar.gif`

**If the branch is master, you only need the repository name.**

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
