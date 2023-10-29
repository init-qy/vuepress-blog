---
title: Un CDN gratuito disponible.
date: 2020-11-17 10:26:32
tag:
  - artefacto
category:
  - artefacto
---

## CDN gratuito

Encontré un CDN útil, marcarlo.

Los recursos de GitHub cargan lentamente en China, por lo que es necesario utilizar un CDN para mejorar la velocidad. JSDelivr + GitHub ofrece un servicio de CDN muy útil.

Para los usuarios individuales, pueden almacenar imágenes en GitHub y acceder a ellas a través de enlaces CDN, lo que es equivalente a utilizar un servicio de almacenamiento en la nube.

## Uso específico

Prepara un repositorio en GitHub y sube las imágenes a este repositorio.

La ruta del CDN es:
`https://cdn.jsdelivr.net/gh/${tu_nombre_de_usuario}/${nombre_del_repositorio}@${rama_o_versión}/ruta_del_archivo`

## Ejemplo

`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io@master/images/avatar.gif`
o
`https://cdn.jsdelivr.net/gh/init-qy/init-qy.github.io/images/avatar.gif`

**Si la rama es "master", solo se necesita el nombre del repositorio.**

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
