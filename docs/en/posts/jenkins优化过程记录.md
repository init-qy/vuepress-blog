---
title: Jenkins Optimization Process Documentation
date: 2022-11-21 15:23:16
tag:
  - Jenkins
category:
  - DevOps
---

## Background

This is a record of my entire process of optimizing Jenkins. The project being deployed is a frontend project, using Node 14, Vue 2, and npm for packaging. It also requires packaging Nginx as a Docker image and deploying it.

## Version 1 (30 minutes)

This version was quite outrageous. When I took over, I was excited to hear about the automated deployment pipeline. However, after enduring it for two months, I couldn't take it anymore. The 30-minute deployment time meant that some issues that needed to be tested online couldn't be seen in a timely manner. Sometimes, if the first deployment failed, it would take another hour to start over.

After examining the duration of each step, I found that the most time-consuming part was the "push to harbor" image push, which took more than 20 minutes each time. There are two possible reasons for this: network issues or image issues.

In this case, it was the latter. I found that the size of an image was about 1GB, which is why the Jenkins server's hard drive was constantly filling up every few days. In fact, the size of the frontend image package was only about 30MB. The reason the image package was so large was because it included the `node_modules` directory 😓.

The solution was to add a `.dockerignore` file to exclude unnecessary directories.

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

With this change, the packaging time was reduced to 3-5 minutes.

## Version 2 (10 minutes)

Later, as the business expanded, a new repository was added, and now the goal was to package A and B together and then package them into an image.

Because of the urgency, I didn't think too much and made the changes directly in the pipeline.

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

With this change, the functionality was roughly implemented, but the packaging time was noticeably longer.

## Version 3 (3-4 minutes)

After the business stabilized, I further optimized the 10-minute duration by using parallel builds.

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

One thing to note is `reuseNode true`. If not set, Jenkins will automatically create a new workspace, and files cannot be transferred between the two workspaces.

Refer to <https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization>

After that, I made some optimizations to `npm install`. If `package.json` is not changed, there is no need to run `npm install` again.

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

## Conclusion

1. Optimization is an ongoing process. Jenkins might be replaced one day.
2. Prioritize referring to the [official documentation](https://www.jenkins.io/doc/book/) and look for the section on `reuseNode true`, as it can be time-consuming.

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
