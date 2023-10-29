const t=JSON.parse('{"key":"v-6034babd","path":"/posts/%E5%85%B3%E4%BA%8Ejs%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E7%9A%84%E4%B8%80%E7%82%B9%E7%A0%94%E7%A9%B6.html","title":"关于js运行机制的一点研究","lang":"zh-CN","frontmatter":{"title":"关于js运行机制的一点研究","date":"2020-12-25T17:38:48.000Z","tag":["js","vue"],"category":["前端开发"],"description":"前言 最近追了阮一峰阮老师的博客，真的是吾辈楷模。写博客不难，难得是一直写博客，一直保持学习、分享的精神。坚持是一件很难的事情，希望我能够坚持下去。言归正传，我是通过阮老师一篇据说被喷的博客（JavaScript 运行机制详解：再谈 Event Loop）中去理解了一下，自己做了一点总结。","head":[["link",{"rel":"canonical","href":"https://init-qy.github.io/vuepress-blog/posts/%E5%85%B3%E4%BA%8Ejs%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E7%9A%84%E4%B8%80%E7%82%B9%E7%A0%94%E7%A9%B6.html"}],["link",{"rel":"alternate","hreflang":"en-us","href":"https://init-qy.github.io/vuepress-blog/en/posts/%E5%85%B3%E4%BA%8Ejs%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E7%9A%84%E4%B8%80%E7%82%B9%E7%A0%94%E7%A9%B6.html"}],["link",{"rel":"alternate","hreflang":"es","href":"https://init-qy.github.io/vuepress-blog/es/posts/%E5%85%B3%E4%BA%8Ejs%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E7%9A%84%E4%B8%80%E7%82%B9%E7%A0%94%E7%A9%B6.html"}],["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/posts/%E5%85%B3%E4%BA%8Ejs%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E7%9A%84%E4%B8%80%E7%82%B9%E7%A0%94%E7%A9%B6.html"}],["meta",{"property":"og:site_name","content":"init-qy的博客"}],["meta",{"property":"og:title","content":"关于js运行机制的一点研究"}],["meta",{"property":"og:description","content":"前言 最近追了阮一峰阮老师的博客，真的是吾辈楷模。写博客不难，难得是一直写博客，一直保持学习、分享的精神。坚持是一件很难的事情，希望我能够坚持下去。言归正传，我是通过阮老师一篇据说被喷的博客（JavaScript 运行机制详解：再谈 Event Loop）中去理解了一下，自己做了一点总结。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"es"}],["meta",{"property":"og:updated_time","content":"2022-11-15T05:58:02.000Z"}],["meta",{"property":"article:author","content":"init-qy"}],["meta",{"property":"article:tag","content":"js"}],["meta",{"property":"article:tag","content":"vue"}],["meta",{"property":"article:published_time","content":"2020-12-25T17:38:48.000Z"}],["meta",{"property":"article:modified_time","content":"2022-11-15T05:58:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"关于js运行机制的一点研究\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2020-12-25T17:38:48.000Z\\",\\"dateModified\\":\\"2022-11-15T05:58:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"init-qy\\",\\"url\\":\\"https://github.com/init-qy\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"Event Loop","slug":"event-loop","link":"#event-loop","children":[]},{"level":2,"title":"vue 中的$nextTick","slug":"vue-中的-nexttick","link":"#vue-中的-nexttick","children":[]},{"level":2,"title":"小程序中的 wx.nextTick","slug":"小程序中的-wx-nexttick","link":"#小程序中的-wx-nexttick","children":[]},{"level":2,"title":"最后","slug":"最后","link":"#最后","children":[]}],"git":{"createdTime":1668049671000,"updatedTime":1668491882000,"contributors":[{"name":"init-qy","email":"953218204@qq.com","commits":2},{"name":"qinye","email":"953218204@qq.com","commits":1}]},"readingTime":{"minutes":2.8,"words":839},"filePathRelative":"posts/关于js运行机制的一点研究.md","localizedDate":"2020年12月25日","excerpt":"<h2> 前言</h2>\\n<p>最近追了阮一峰阮老师的博客，真的是吾辈楷模。写博客不难，难得是一直写博客，一直保持学习、分享的精神。坚持是一件很难的事情，希望我能够坚持下去。言归正传，我是通过阮老师一篇据说被喷的博客（<a href=\\"http://www.ruanyifeng.com/blog/2014/10/event-loop.html\\" title=\\"JavaScript 运行机制详解：再谈Event Loop\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">JavaScript 运行机制详解：再谈 Event Loop</a>）中去理解了一下，自己做了一点总结。</p>","autoDesc":true}');export{t as data};
