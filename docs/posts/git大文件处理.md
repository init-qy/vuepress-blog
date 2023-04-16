---
title: git大文件处理
date: 2023-04-16 12:21:06
tag: ["git"]
category: ["DevOps"]
---

## 背景

最近在开发`flutter+unity`的手机 app 项目，因为第一次开发`unity`，并不是很了解`unity`的文件目录，有很多测试用资产(Assets)中的 3d 模型文件也被放进了`git`中，这就造成了`git`仓库的庞大。

其实这种资产管理用`svn`处理会更好，毕竟包含了大量图片，音频及二进制文件，但目前项目很小，用`git`管理也还好。

## 步骤

1. 查看 git 仓库大小

   ```sh
   git count-objects -vH
   ```

2. 查看有哪些大文件

   ```sh
   git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}')"
   ```

3. 从 git 所有分支历史中删除该文件

   ```sh
   git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch <bigfile>' --prune-empty --tag-name-filter cat -- --all
   ```

4. 回收本地空间

   ```sh
   rm -rf .git/refs/original/
   git reflog expire --expire=now --all
   git gc --prune=now
   git gc --aggressive --prune=now
   ```

5. 推送到远端仓库

   ```sh
   git push origin --force --all
   ```

## 其他

在上述步骤执行完毕并推送到远端后，有时会发现远端的 git 仓库不仅没有变小，甚至变大了，这是因为远端的`git`仓库没有 gc。

我使用的是公司内部的`GitLab`，仅以此为例，可以使用`GitLab`的[`Housekeeping`](https://docs.gitlab.com/ee/administration/housekeeping.html#running-housekeeping-tasks)功能即可。

更多详情可以参考[这篇文章](https://juejin.cn/post/7024922528514572302)
