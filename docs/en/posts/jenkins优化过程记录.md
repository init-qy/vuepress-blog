---
title: Jenkins优化过程记录
date: 2022-11-21 15:23:16
tag: ["Jenkins"]
category: ["DevOps"]
---

## 背景

仅此记录下我的 Jenkins 优化全过程。部署项目是一个前端项目，node14，vue2，使用 npm 打包，需要将 nginx 同时打包为一个 docker 镜像并部署。

## 第一版(30min)

这一版相当离谱，我接手的时候听说有自动化部署流水线还十分兴奋，但是忍了两个月后实在是受不了。长达 30 分钟的部署时长意味着有些需要线上测试的问题不能及时看到效果，有时第一次部署失败的话又需要一个小时起步。

在对每一个步骤查看时长后，我发现最耗时的部分竟然是`push to harbor`推送镜像的部分，每一次推送时长竟然都达到了 20+分钟，这里有两种可能：网络问题或者镜像问题。

这里的情况是后者，我发现一次镜像的大小竟然达到了大约 1G，我想这也是为什么 Jenkins 服务器三天两头硬盘占满的原因之一。事实上，前端镜像打包出来的大小只有 30M 左右，镜像包如此之大的原因是因为它把`node_modules`也放了进去 😓。

解决方法是加个`.dockerignore`文件，去除不需要的目录

```docker
# Ignore everything
**
# Allow files and directories
!dist
!Dockerfile
!ssl
!default.conf
!nginx.conf
!nginx_reconfigure.sh
```

如此，打包时长来到了 3~5 分钟

## 第二版(10min)

后来随着业务的扩展，新加了一个 repo 进来，现在需要实现的是一次打包 A 和 B，然后将其打包为镜像。

因为比较着急，没有过多思考，直接在 pipeline 中修改。

```pipeline
agent {
    docker {
        image 'node:14.19.1-stretch-slim'
        args '-p 3001:3000'
    }
}
steps {
    git(url: env.burl, branch: 'master')
    sh 'npm install'
    sh 'npm run build'
    sh 'rm -rf node_modules'
    git(url: env.url, branch: 'master')
    sh 'npm install'
    sh 'npm run build'
    sh 'mv b dist'
    sh 'rm -rf node_modules'
}
```

如此大致实现了这个功能，但是打包时长明显更长。

## 第三版(3~4min)

在业务稳定下来后，针对 10 分钟的时长我又进一步做了优化，使用 parallel 进行并发构建。

```pipeline
parallel {
    stage('main') {
        agent {
            docker {
                image 'node:14.19.1-stretch-slim'
                reuseNode true
            }
        }
        steps {
            git(url: env.url, branch: 'master')
            sh 'npm install'
            sh 'npm run build'
        }
    }
    stage('skywalking-ui') {
        agent {
            docker {
                image 'node:14.19.1-stretch-slim'
                reuseNode true
            }
        }
        steps {
            checkout([
                $class: 'GitSCM',
                branches: [[name: 'master']],
                userRemoteConfigs: [[url: env.burl]],
                extensions: [[
                    $class: 'RelativeTargetDirectory',
                    relativeTargetDir: 'b'
                ]]
            ])
            dir('b') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}
```

其中必须要注意的是`reuseNode true`，如果不设置，Jenkins 会自动创建新的工作区，两个工作区之间无法相互传输文件。

Refer to <https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization>

之后我又对`npm install`进行了一些优化，在未改变`package.json`时，其实无需重新`npm install`。

```shell
    # file exit or not
    if [ ! -f "package.json.md5" ];then
        echo "file does not exist"
        npm install
        md5sum package.json>package.json.md5
    else
        echo "file already exists"
    fi

    # Check whether the md5sum has changed
    if(md5sum -c --status package.json.md5);then
        echo "md5 no changed"
    else
        echo "md5 changed"
        npm install
        md5sum package.json>package.json.md5
    fi
```

## 总结

1. 优化是持续的过程，说不定哪天 Jenkins 就退环境了。
2. 优先看[官方文档](https://www.jenkins.io/doc/book/)，寻找`reuseNode true`那段最耗费时间。
