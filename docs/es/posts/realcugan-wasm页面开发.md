---
title: Desarrollo de páginas web en real-cugan-wasm
date: 2023-07-26 15:39:35
tag:
  - real-cugan
  - wasm
category:
  - desarrollo front-end
---

Aquí registro aproximadamente una semana de mi proceso de incrustación de páginas wasm en vuepress, que involucra muchos aspectos, incluyendo ([git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules),[emscripten](https://github.com/emscripten-core/emscripten),[naive-ui](https://naiveui.com),[COOP-COEP](https://web.dev/coop-coep/)) la exploración y uso de estas tecnologías. Actualmente, esta [página de herramientas](../tools/realcugan-ncnn-webassembly) está casi terminada y tiene una buena experiencia en el navegador Chrome.

## Antecedentes

Por casualidad, me enteré de que Bilibili lanzó una herramienta de IA llamada [Real-CUGAN](https://github.com/bilibili/ailab/tree/main/Real-CUGAN) y vi su implementación wasm en una [página web](https://real-cugan.animesales.xyz/), así que se me ocurrió la idea de intentar incrustarla en vuepress y ponerla en mi propio blog.

## Proceso

Esta implementación fue bastante compleja y encontré varios problemas que nunca había enfrentado antes, lo que me dio mucha experiencia. La implementación de todo el `wasm` se basó en gran medida en la lógica de [realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly), pero actualicé la parte de `models-pro` según [realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro). A continuación, registraré el proceso de uso y los problemas encontrados para cada una de las tecnologías utilizadas.

### git submodule

El autor del repositorio [realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly) en realidad no subió el `git submodule`, por lo que clonar directamente este repositorio y ejecutar `git submodule update --init` no funcionará y no se podrá determinar la versión del `submodule`. Por lo tanto, no pude usar la última versión de `ncnn` que se ejecutó y finalmente confirmé la versión según [realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro).

Al mismo tiempo, agregué `emsdk` al `submodule`, lo que me permitió configurar `emscripten` directamente en `github action` y completar el proceso de compilación posterior.

### emscripten

Como esta vez no desarrollé completamente el `wasm`, solo realicé algunas actualizaciones y migraciones según el repositorio del experto, no tengo un profundo conocimiento de ello, solo hay tres puntos a tener en cuenta:

- Es mejor especificar la versión de emscripten, ya que no estoy seguro si las nuevas versiones tienen actualizaciones destructivas y no encontré documentación detallada de las actualizaciones.
- `-sEXPORTED_FUNCTIONS` especifica las funciones de salida y las expone en `Module`. Si encuentras `_xxFun not defined`, debes modificarlo en `CMakeList.txt`.
- Es necesario borrar la caché de compilación, de lo contrario podrían surgir problemas inesperados.

### Introducción de Unocss y Naive Ui

Unocss es relativamente simple y no he encontrado problemas de superposición de estilos, solo necesita ser configurado:

```ts
Unocss({
  mode: "per-module",
});
```

Naive Ui es un poco más complejo y requiere algunos pasos:

- En primer lugar, no se puede utilizar el método de referencia automática de la serie `unplugin` para escribir el código, debe ser importado manualmente.
- Luego, es necesario envolver el componente con el componente `<ClientOnly>` en el nivel más externo para omitir la compilación ssg.
- Los componentes como message, dialog, etc., se utilizan a través de `createDiscreteApi`.
- Por último, es necesario configurar el ssr para que se pueda compilar correctamente:

```ts
ssr: {
  noExternal: ['naive-ui', 'vueuc', 'date-fns'],
}
```

Estas configuraciones y su uso pueden parecer simples, pero en realidad detrás de cada conclusión hay muchos intentos. Puedes encontrar estas configuraciones en [este repositorio](https://github.com/init-qy/vuepress-blog/blob/master/docs/.vuepress/config.ts#L46-L55).

### Uso de archivos wasm

Después de generar los archivos con `emscripten`, necesitamos colocarlos en la misma carpeta que los archivos de modelo para que puedan ser leídos y utilizados por estos modelos. Durante el desarrollo, tuve muchos problemas con la ubicación de lectura de estos archivos. El archivo js generado lee el modelo `.bin` utilizando una ruta relativa, y la ruta de mi página es `/tools/realcugan-ncnn-webassembly.html`, lo que significa que intentará obtener el archivo `/tools/xxx.bin`. Esto implica que debo colocar los archivos generados `.js, .wasm, .bin` en la carpeta `public/tools`.

Además, debido al soporte de `i18n`, no se puede leer el modelo `.bin` desde otra URL en inglés, como `/en/tools/realcugan-ncnn-webassembly.html`. Si esto fuera en mi propio servidor, sería fácil de solucionar, simplemente escribiría una redirección en nginx. Sin embargo, como mi sitio web está alojado en `github.io`, la forma más fácil y rápida de solucionar esto es colocar una copia completa de los archivos de recursos en la carpeta correspondiente. La desventaja es que ocupa más espacio de almacenamiento en el repositorio. En mi caso, utilicé un método muy "hack" para redirigirlo forzadamente a través de un "work server".

```js
// do something Redirect
const pattern = /.+\/en\/tools\/.+\.(js|wasm|bin|param|data|jpg)$/;
if (pattern.test(request.url)) {
  request = new Request(request.url.replaceAll("/en/tools", "/tools"), {
    cache: request.cache,
    credentials: request.credentials,
    headers: request.headers,
    integrity: request.integrity,
    destination: request.destination,
    keepalive: request.keepalive,
    method: request.method,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
}
```

#### **---Actualización del 2 de agosto de 2023---**

`emscripten` tiene un método expuesto llamado `locateFile`, que permite redirigir los archivos cargados utilizando un CDN u otra URL. Por lo tanto, eliminé el método de redirección "hack".

```ts
locateFile: (path: string, prefix: string) => {
  return prefix.replace('/en/', '/') + path
},
```

No estoy seguro de cómo afecta el uso de wasm en múltiples páginas, pero tuve problemas al cambiar entre diferentes pestañas: `onRuntimeInitialized` solo se ejecuta una vez. Por lo tanto, utilicé la forma más conveniente, rápida y menos propensa a errores para resolver este problema: recargar la página al ingresar.
Esto puede ser confuso, pero es la mejor solución que se me ocurrió.

### COOP-COEP

La política de mismo origen es una barrera impuesta por los navegadores, solo cuando el servidor firma el ~~acuerdo~~ mismo origen, puede proporcionarte un `sharedbuffer`. Aquí también se utiliza un método "hack" para que la aplicación wasm funcione correctamente, consultando [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker). Debido a esto, esta herramienta solo se puede ejecutar en Chrome y Edge, consulta (<https://caniuse.com/mdn-api_window_credentialless>).

## Próximos pasos

Con la experiencia de desarrollo de esta vez, en realidad hay muchas más cosas que se pueden hacer. Teóricamente, puedo desarrollar cualquier programa en el navegador sin preocuparme por las limitaciones de lenguaje o entorno. Tal vez haya una falta de velocidad de ejecución, pero como dice el refrán: "si funciona, está bien".

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
