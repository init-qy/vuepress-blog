---
title: Registro del proceso de optimización de Jenkins
date: 2022-11-21 15:23:16
tag:
  - Jenkins
category:
  - DevOps
---

## Background

Aquí registro todo el proceso de optimización de mi Jenkins. El proyecto desplegado es un proyecto frontend, con node14, vue2, utilizando npm para empaquetar, y se necesita empaquetar también nginx en una imagen de Docker y desplegarlo.

## Versión 1 (30 minutos)

Esta versión fue bastante absurda, cuando me hice cargo, me emocioné al escuchar que había un pipeline de despliegue automatizado, pero después de aguantar dos meses, ya no pude más. El tiempo de despliegue de 30 minutos significa que algunos problemas que necesitan ser probados en línea no se pueden ver de inmediato, y a veces, si el primer despliegue falla, se necesita otra hora para comenzar de nuevo.

Después de revisar la duración de cada paso, descubrí que la parte que más tiempo consume es la de "push to harbor", cada vez que se realiza el push, lleva más de 20 minutos. Hay dos posibilidades aquí: un problema de red o un problema con la imagen.

En este caso, es lo último, descubrí que el tamaño de la imagen era de aproximadamente 1 GB, supongo que esta es una de las razones por las que el disco del servidor de Jenkins se llena constantemente. De hecho, el tamaño del paquete de la imagen frontend es solo de alrededor de 30 MB, la razón por la que el paquete de la imagen es tan grande es porque también incluye `node_modules` 😓.

La solución es agregar un archivo `.dockerignore` para excluir los directorios innecesarios.

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

Con esto, el tiempo de empaquetado se redujo a 3-5 minutos.

## Versión 2 (10 minutos)

Luego, con la expansión del negocio, se agregó un nuevo repositorio y ahora se necesita empaquetar A y B juntos en una imagen.

Debido a la urgencia, no pensé demasiado y realicé la modificación directamente en el pipeline.

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

De esta manera, se implementó aproximadamente esta funcionalidad, pero el tiempo de empaquetado obviamente se incrementó.

## Versión 3 (3-4 minutos)

Después de que el negocio se estabilizó, optimicé aún más el tiempo de 10 minutos utilizando la construcción en paralelo.

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

Es importante tener en cuenta `reuseNode true`, si no se establece, Jenkins creará automáticamente un nuevo espacio de trabajo y los archivos no se pueden transferir entre los dos espacios de trabajo.

Consultar <https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization>

Luego, realicé algunas optimizaciones en `npm install`, cuando no se cambia `package.json`, en realidad no es necesario ejecutar `npm install` nuevamente.

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

## Conclusiones

1. La optimización es un proceso continuo, quién sabe si algún día Jenkins se retirará del entorno.
2. Prioriza consultar la [documentación oficial](https://www.jenkins.io/doc/book/), busca la sección de `reuseNode true` que es la que más tiempo consume.

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
