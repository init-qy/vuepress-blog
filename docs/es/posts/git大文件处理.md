---
title: Manejo de archivos grandes en git
date: 2023-04-16 12:21:06
tag:
  - git
category:
  - DevOps
---

## Background

Recientemente he estado desarrollando un proyecto de aplicación móvil con `flutter+unity`. Como es la primera vez que desarrollo con `unity`, no estoy muy familiarizado con la estructura de archivos de `unity`. Muchos archivos de modelos 3D de prueba en los activos (Assets) también se han incluido en el repositorio de `git`, lo que ha llevado a que el repositorio de `git` sea muy grande.

En realidad, este tipo de gestión de activos se manejaría mejor con `svn`, ya que incluye una gran cantidad de imágenes, archivos de audio y binarios. Sin embargo, el proyecto actual es pequeño y la gestión con `git` está bien.

## Pasos

1. Verificar el tamaño del repositorio de git

   ```sh
   git count-objects -vH
   ```

2. Verificar los archivos grandes

   ```sh
   git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}')"
   ```

3. Eliminar el archivo de todo el historial de ramas de git

   ```sh
   git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch <bigfile>' --prune-empty --tag-name-filter cat -- --all
   ```

4. Liberar espacio local

   ```sh
   rm -rf .git/refs/original/
   git reflog expire --expire=now --all
   git gc --prune=now
   git gc --aggressive --prune=now
   ```

5. Hacer push al repositorio remoto

   ```sh
   git push origin --force --all
   ```

## Otros

Después de completar los pasos anteriores y hacer push al repositorio remoto, a veces se puede observar que el repositorio de git remoto no solo no se ha reducido, sino que incluso ha aumentado de tamaño. Esto se debe a que el repositorio de git remoto no ha sido sometido a un proceso de gc.

Estoy utilizando `GitLab` interno de la empresa como ejemplo, pero se puede utilizar la funcionalidad de [`Housekeeping`](https://docs.gitlab.com/ee/administration/housekeeping.html#running-housekeeping-tasks) de GitLab para solucionar este problema.

Para obtener más detalles, puedes consultar [este artículo](https://juejin.cn/post/7024922528514572302).

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
