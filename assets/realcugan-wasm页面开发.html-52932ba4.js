const e=JSON.parse('{"key":"v-48ef3ac1","path":"/posts/realcugan-wasm%E9%A1%B5%E9%9D%A2%E5%BC%80%E5%8F%91.html","title":"real-cugan-wasm页面开发","lang":"zh-CN","frontmatter":{"title":"real-cugan-wasm页面开发","date":"2023-07-26T15:39:35.000Z","tag":["real-cugan","wasm"],"category":["前端开发"],"description":"仅此记录下自己大约一周的wasm页面嵌入vuepress的过程，其中涉及到许多方面的内容，包括（git submodule,emscripten,naive-ui,COOP-COEP）这些技术的探索与使用。目前这个工具页面已经大致完成，并在chrome浏览器中有了较好的体验。","head":[["link",{"rel":"canonical","href":"https://init-qy.github.io/vuepress-blog/posts/realcugan-wasm%E9%A1%B5%E9%9D%A2%E5%BC%80%E5%8F%91.html"}],["link",{"rel":"alternate","hreflang":"en-us","href":"https://init-qy.github.io/vuepress-blog/en/posts/realcugan-wasm%E9%A1%B5%E9%9D%A2%E5%BC%80%E5%8F%91.html"}],["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/posts/realcugan-wasm%E9%A1%B5%E9%9D%A2%E5%BC%80%E5%8F%91.html"}],["meta",{"property":"og:site_name","content":"init-qy的博客"}],["meta",{"property":"og:title","content":"real-cugan-wasm页面开发"}],["meta",{"property":"og:description","content":"仅此记录下自己大约一周的wasm页面嵌入vuepress的过程，其中涉及到许多方面的内容，包括（git submodule,emscripten,naive-ui,COOP-COEP）这些技术的探索与使用。目前这个工具页面已经大致完成，并在chrome浏览器中有了较好的体验。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-07-28T07:44:51.000Z"}],["meta",{"property":"article:author","content":"init-qy"}],["meta",{"property":"article:tag","content":"real-cugan"}],["meta",{"property":"article:tag","content":"wasm"}],["meta",{"property":"article:published_time","content":"2023-07-26T15:39:35.000Z"}],["meta",{"property":"article:modified_time","content":"2023-07-28T07:44:51.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"real-cugan-wasm页面开发\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-26T15:39:35.000Z\\",\\"dateModified\\":\\"2023-07-28T07:44:51.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"init-qy\\",\\"url\\":\\"https://github.com/init-qy\\"}]}"]]},"headers":[{"level":2,"title":"背景","slug":"背景","link":"#背景","children":[]},{"level":2,"title":"过程","slug":"过程","link":"#过程","children":[{"level":3,"title":"git submodule","slug":"git-submodule","link":"#git-submodule","children":[]},{"level":3,"title":"emscripten","slug":"emscripten","link":"#emscripten","children":[]},{"level":3,"title":"Unocss及Naive Ui的引入","slug":"unocss及naive-ui的引入","link":"#unocss及naive-ui的引入","children":[]},{"level":3,"title":"wasm文件的使用","slug":"wasm文件的使用","link":"#wasm文件的使用","children":[]},{"level":3,"title":"COOP-COEP","slug":"coop-coep","link":"#coop-coep","children":[]}]},{"level":2,"title":"下一步","slug":"下一步","link":"#下一步","children":[]}],"git":{"createdTime":1690530291000,"updatedTime":1690530291000,"contributors":[{"name":"ucr_qinye","email":"953218204@qq.com","commits":1}]},"readingTime":{"minutes":4.53,"words":1360},"filePathRelative":"posts/realcugan-wasm页面开发.md","localizedDate":"2023年7月26日","excerpt":"<p>仅此记录下自己大约一周的wasm页面嵌入vuepress的过程，其中涉及到许多方面的内容，包括（<a href=\\"https://git-scm.com/book/en/v2/Git-Tools-Submodules\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">git submodule</a>,<a href=\\"https://github.com/emscripten-core/emscripten\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">emscripten</a>,<a href=\\"https://naiveui.com\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">naive-ui</a>,<a href=\\"https://web.dev/coop-coep/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">COOP-COEP</a>）这些技术的探索与使用。目前这个<a href=\\"../tools/realcugan-ncnn-webassembly\\">工具页面</a>已经大致完成，并在chrome浏览器中有了较好的体验。</p>","autoDesc":true}');export{e as data};
