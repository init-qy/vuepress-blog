---
title: real-cugan-wasm页面开发
date: 2023-07-26 15:39:35
tag: ["real-cugan", "wasm"]
category: ["前端开发"]
---

仅此记录下自己大约一周的wasm页面嵌入vuepress的过程，其中涉及到许多方面的内容，包括（[git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules),[emscripten](https://github.com/emscripten-core/emscripten),[naive-ui](https://naiveui.com),[COOP-COEP](https://web.dev/coop-coep/)）这些技术的探索与使用。目前这个[工具页面](../tools/realcugan-ncnn-webassembly)已经大致完成，并在chrome浏览器中有了较好的体验。

## 背景

一次偶然的机会我了解到b站出了一个AI工具[Real-CUGAN](https://github.com/bilibili/ailab/tree/main/Real-CUGAN)，并看到了其中的[网页wasm实现](https://real-cugan.animesales.xyz/)，然后突发奇想试试在vuepress中嵌入实现，放在我自己的博客里。

## 过程

这次的实现还是比较复杂的，中间遇到了不少问题，都是首次遇到，也算是增加了不少经验。整个`wasm`的实现大部分参考了[realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly)的逻辑，但是根据[realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro)更新成了其中的`models-pro`。接下来我会根据每个用到的技术记录下使用过程和遇到的问题。

### git submodule

[realcugan-ncnn-webassembly](https://github.com/hanFengSan/realcugan-ncnn-webassembly)这个仓库作者其实没有把`git submodule`上传，因此直接克隆这个仓库并执行`git submodule update --init`无法生效，也无法确定`submodule`的版本，因此我使用最新版的`ncnn`跑出来的根本无法使用，最后还是根据[realcugan-ncnn-webassembly](https://github.com/nihui/realcugan-ncnn-vulkan/tree/master/models/models-pro)确认了版本。

同时，我把`emsdk`放进了`submodule`中，这样就可以直接在`github action`中设置`emscripten`，完成后续的编译过程。

### emscripten

因为本次并没有完整的开发`wasm`，只是根据大佬的仓库进行了一些更新和迁移，因此对其了解不深，只有三点需要注意：
- emscripten的版本最好指定，因为不清楚新版本是否有破坏性更新，我也没有找到详细的更新文档。
- `-sEXPORTED_FUNCTIONS`制定了输出函数，使其暴露在`Module`中，如果你发现`_xxFun not defined`，应该在`CMakeList.txt`中修改。
- build缓存需要清空，否则可能有意料之外的问题。

### Unocss及Naive Ui的引入

Unocss相对简单，目前还未发现样式覆盖的问题，只需要配置即可：

```ts
Unocss({
  mode: 'per-module',
})
```

Naive Ui相对复杂，需要分成几点：
- 首先是无法使用`unplugin`系列的自动引用方法来编写代码，必须要手动引用。
- 然后是需要在组件的最外边包裹`<ClientOnly>`组件，让它跳过ssg编译。
- message,dialog等组件通过`createDiscreteApi`来使用。
- 最后需要设置ssr，这样才能build成功：

```ts
ssr: {
  noExternal: ['naive-ui', 'vueuc', 'date-fns'],
}
```

这些配置和使用看起来很简单，实际上每一条结论的得出背后都需要很多次的尝试。这些配置都在[本仓库](https://github.com/init-qy/vuepress-blog/blob/master/docs/.vuepress/config.ts#L46-L55)中可以找到。

### wasm文件的使用

在使用`emscripten`生成完文件后，我们需要把它们和模型文件放在同一文件夹中，使其能够读取使用这些模型。
在实际开发过程中，我因为这些文件的读取位置问题有许多困扰，在生成的js文件中读取`.bin`模型使用的是相对路径，而我页面的路径为`/tools/realcugan-ncnn-webassembly.html`,也就是说它会尝试获取`/tools/xxx.bin`这个文件，这就意味着我需要把生成的`.js,.wasm,.bin`放在`public/tools`文件夹下。
同时，由于支持`i18n`的原因，另一个英文网址`/en/tools/realcugan-ncnn-webassembly.html`无法读取`.bin`模型，这个问题如果是自己的服务器应该很好解决，直接给nginx写一个重定向即可，可是由于我的网站部署在`github.io`上，最简单快捷图省事的方法是在相对应的文件夹下放一份完全相同的资源文件，问题就迎刃而解，缺点是比较占仓库存储。我这里采用了一个非常hack的方法，通过`work server`强行对其进行重定向。

```js
// do something Redirect
const pattern = /.+\/en\/tools\/.+\.(js|wasm|bin|param|data|jpg)$/
if (pattern.test(request.url)) {
  request = new Request(request.url.replaceAll('/en/tools', '/tools'), {
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
  })
}
```

**---2023-08-02更新---**

`emscripten`有暴露方法`locateFile`，可以对加载的文件进行重定向，使用cdn或其他URL。因此我去掉了hack的重定向方法。

```ts
locateFile: (path: string, prefix: string) => {
  return prefix.replace('/en/', '/') + path
},
```

我不太清楚多页面对wasm应用的影响，但是我的确在各个标签切换的时候出现了问题：`onRuntimeInitialized`只执行一次。因此，我采用了最方便，最快捷，最不会出错的方式解决这个问题：在进入页面时reload。
这样或许会令人困惑，但这已经是我能想到的最好解法了。

### COOP-COEP

同源策略是浏览器强加的一道坎，只有服务器签署了~~我同意该协议~~同源，才能给你提供`sharedbuffer`，这里同样使用了一种很hack的方法来使wasm应用能正常运行，参考[coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker)，也因为这样，这个工具只能在chrome,edge运行，参考(https://caniuse.com/mdn-api_window_credentialless)。


## 下一步

有了本次的开发经验，其实能做的事情又多了很多，我理论上可以在浏览器里开发任意功能的程序，而不用在意语言、环境的限制，或许在运行速度上有所欠缺，但有句话是这么说的：能用就行。
