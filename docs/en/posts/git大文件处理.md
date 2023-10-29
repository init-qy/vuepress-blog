---
title: Handling Large Files in Git
date: 2023-04-16 12:21:06
tag:
  - git
category:
  - DevOps
---

## Background

Recently, I have been working on a mobile app project using `flutter+unity`. Since it is my first time developing with `unity`, I am not very familiar with the file structure of `unity`. As a result, many 3D model files from the test assets have been included in the `git` repository, causing the repository to become bloated.

In fact, managing these assets with `svn` would be better, considering the large number of images, audio, and binary files involved. However, since the project is currently small, managing them with `git` is still acceptable.

## Steps

1. Check the size of the git repository

   ```sh
   git count-objects -vH
   ```

2. Identify the large files

   ```sh
   git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}')"
   ```

3. Remove the files from the git repository history

   ```sh
   git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch <bigfile>' --prune-empty --tag-name-filter cat -- --all
   ```

4. Reclaim local space

   ```sh
   rm -rf .git/refs/original/
   git reflog expire --expire=now --all
   git gc --prune=now
   git gc --aggressive --prune=now
   ```

5. Push to the remote repository

   ```sh
   git push origin --force --all
   ```

## Other

After completing the above steps and pushing to the remote repository, you may sometimes find that the remote git repository not only did not decrease in size, but even increased. This is because the remote `git` repository has not been garbage collected.

I am using the internal `GitLab` of the company as an example. You can use the [`Housekeeping`](https://docs.gitlab.com/ee/administration/housekeeping.html#running-housekeeping-tasks) feature of `GitLab` to address this issue.

For more details, please refer to [this article](https://juejin.cn/post/7024922528514572302).

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
