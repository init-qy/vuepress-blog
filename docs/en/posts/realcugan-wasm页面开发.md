---
title: Real-cugan-wasm page development
date: 2023-07-26 15:39:35
tag:
  - real-cugan
  - wasm
category:
  - front-end development
---

Just record my process of embedding a wasm page into vuepress for about a week. It involves many aspects, including [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules), [emscripten](https://github.com/emscripten-core/emscripten), [naive-ui](https://naiveui.com), [COOP-COEP](https://web.dev/coop-coep/), and the exploration and use of these technologies. Currently, this [tool page](../tools/realcugan-ncnn-webassembly) has been roughly completed and has a good experience in the Chrome browser.

## Background

By chance, I learned that Bilibili released an AI tool called [Real-CUGAN](https://github.com/bilibili/ailab/tree/main/Real-CUGAN), and saw its [web wasm implementation](https://real-cugan.animesales.xyz/). Then I had the idea of embedding it into vuepress and putting it on my own blog.

## Process

This implementation is still relatively complex, and I encountered many problems in the middle, all of which were encountered for the first time, which also added a lot of experience. The implementation of the entire `wasm` mostly refers to the logic of [realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly), but it has been updated to the `models-pro` in [realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro). Next, I will record the usage and problems encountered according to each technology used.

### git submodule

The author of [realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly) did not upload the `git submodule`, so cloning this repository and executing `git submodule update --init` will not take effect, and the version of `submodule` cannot be determined. Therefore, the version of `ncnn` I ran with the latest version cannot be used at all, and finally, I confirmed the version according to [realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro).

At the same time, I put `emsdk` into the `submodule`, so that `emscripten` can be set directly in `github action` to complete the subsequent compilation process.

### emscripten

Because this time I didn't develop `wasm` completely, I just made some updates and migrations based on the repository of the great god, so I don't know much about it, there are only three points to note:

- It is best to specify the version of emscripten because it is not clear whether the new version has destructive updates, and I have not found detailed update documents.
- `-sEXPORTED_FUNCTIONS` specifies the output functions to expose them in `Module`. If you find `_xxFun not defined`, you should modify it in `CMakeList.txt`.
- The build cache needs to be cleared, otherwise there may be unexpected problems.

### Introduction of Unocss and Naive Ui

Unocss is relatively simple, and I have not found any style override issues so far, just need to configure it:

```ts
Unocss({
  mode: "per-module",
});
```

Naive Ui is relatively complex and needs to be divided into several points:

- First, it is impossible to use the automatic reference method of the `unplugin` series to write code, and manual reference is required.
- Then, you need to wrap the `<ClientOnly>` component outside the component to skip ssg compilation.
- Components such as message and dialog are used through `createDiscreteApi`.
- Finally, SSR needs to be set up in order to build successfully:

```ts
ssr: {
  noExternal: ['naive-ui', 'vueuc', 'date-fns'],
}
```

These configurations and usage may seem simple, but in reality, each conclusion requires many attempts to reach. These configurations can be found in [this repository](https://github.com/init-qy/vuepress-blog/blob/master/docs/.vuepress/config.ts#L46-L55).

### Using wasm files

After generating the files using `emscripten`, we need to place them in the same folder as the model files so that they can be read and used by the application. During the development process, I encountered many difficulties with the file reading location. The generated JavaScript file reads the `.bin` model using a relative path. In my case, the page path is `/tools/realcugan-ncnn-webassembly.html`, which means it will attempt to access the file `/tools/xxx.bin`. This implies that I need to place the generated `.js`, `.wasm`, and `.bin` files in the `public/tools` folder.

Additionally, due to support for `i18n`, the English version of the website `/en/tools/realcugan-ncnn-webassembly.html` is unable to read the `.bin` model. This problem can be easily solved on a self-hosted server by writing a redirect in Nginx. However, since my website is deployed on `github.io`, the simplest and most convenient solution is to place an identical copy of the resource files in the corresponding folder. This solves the problem, but it does consume more repository storage. I have used a rather hacky method here by forcibly redirecting it through a work server.

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

#### **---Updated on August 2, 2023---**

`emscripten` provides the `locateFile` method, which allows for redirection of the loaded files using a CDN or other URLs. Therefore, I have removed the hacky redirect method.

```ts
locateFile: (path: string, prefix: string) => {
  return prefix.replace('/en/', '/') + path
},
```

I am not sure about the impact of multiple pages on wasm applications, but I did encounter a problem when switching between tabs: `onRuntimeInitialized` only executes once. Therefore, I have used the most convenient, fastest, and least error-prone way to solve this problem: reloading the page when entering it.
This may be confusing, but it is the best solution I can think of.

### COOP-COEP

The same-origin policy is a barrier imposed by browsers. Only when the server signs the ~~I agree to this protocol~~ same-origin agreement can it provide you with a `sharedbuffer`. Here, I have also used a hacky method to ensure the proper functioning of the wasm application, referring to [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker). Because of this, this tool can only run on Chrome and Edge, as referenced in (<https://caniuse.com/mdn-api_window_credentialless>).

## Next Steps

With the experience gained from this development, there are actually many more things that can be done. In theory, I can develop any functional program in the browser without worrying about language or environment limitations. Perhaps there may be some shortcomings in terms of runtime speed, but as the saying goes, "If it works, it works."

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
