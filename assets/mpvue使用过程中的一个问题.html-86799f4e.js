const e=JSON.parse('{"key":"v-d1dd23c6","path":"/posts/mpvue%E4%BD%BF%E7%94%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E9%97%AE%E9%A2%98.html","title":"mpvue使用过程中的一个问题","lang":"zh-CN","frontmatter":{"title":"mpvue使用过程中的一个问题","date":"2020-11-27T20:48:08.000Z","tag":["小程序","mpvue"],"category":["前端开发"],"description":"前言 虽然说都快 1202 年了，还在使用 mpvue 可能已经跟不上时代。但是 mpvue 仍然是我认为写小程序前端最靠近 vue 写法的框架，而且从使用情况来看，即使已经两年没有更新，使用 mpvue 框架编写小程序前端依然没有什么致命的问题，我觉得只要小程序的主要框架不发生大的改变，mpvue 的使用就没有太大的问题。 从移动端前端的发展来看，小程序的出现是革命性的。最主要的是小程序不仅提供了较为简单的开发环境，降低了开发成本；同时提供了国民级软件（如微信）的用户信息。这点尤为重要：app 的构建太过沉重，用户量的累积也过于漫长，这点限制了规模较小商户的会员体系构建，而小程序解决了这个问题，并同时为双方创造收益，商户获得了用户流量入口，微信也可以借此扩大自身的影响。","head":[["link",{"rel":"canonical","href":"https://init-qy.github.io/vuepress-blog/posts/mpvue%E4%BD%BF%E7%94%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E9%97%AE%E9%A2%98.html"}],["link",{"rel":"alternate","hreflang":"en-us","href":"https://init-qy.github.io/vuepress-blog/en/posts/mpvue%E4%BD%BF%E7%94%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E9%97%AE%E9%A2%98.html"}],["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/posts/mpvue%E4%BD%BF%E7%94%A8%E8%BF%87%E7%A8%8B%E4%B8%AD%E7%9A%84%E4%B8%80%E4%B8%AA%E9%97%AE%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"init-qy的博客"}],["meta",{"property":"og:title","content":"mpvue使用过程中的一个问题"}],["meta",{"property":"og:description","content":"前言 虽然说都快 1202 年了，还在使用 mpvue 可能已经跟不上时代。但是 mpvue 仍然是我认为写小程序前端最靠近 vue 写法的框架，而且从使用情况来看，即使已经两年没有更新，使用 mpvue 框架编写小程序前端依然没有什么致命的问题，我觉得只要小程序的主要框架不发生大的改变，mpvue 的使用就没有太大的问题。 从移动端前端的发展来看，小程序的出现是革命性的。最主要的是小程序不仅提供了较为简单的开发环境，降低了开发成本；同时提供了国民级软件（如微信）的用户信息。这点尤为重要：app 的构建太过沉重，用户量的累积也过于漫长，这点限制了规模较小商户的会员体系构建，而小程序解决了这个问题，并同时为双方创造收益，商户获得了用户流量入口，微信也可以借此扩大自身的影响。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2022-11-15T05:58:02.000Z"}],["meta",{"property":"article:author","content":"init-qy"}],["meta",{"property":"article:tag","content":"小程序"}],["meta",{"property":"article:tag","content":"mpvue"}],["meta",{"property":"article:published_time","content":"2020-11-27T20:48:08.000Z"}],["meta",{"property":"article:modified_time","content":"2022-11-15T05:58:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"mpvue使用过程中的一个问题\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2020-11-27T20:48:08.000Z\\",\\"dateModified\\":\\"2022-11-15T05:58:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"init-qy\\",\\"url\\":\\"https://github.com/init-qy\\"}]}"]]},"headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"问题","slug":"问题","link":"#问题","children":[]},{"level":2,"title":"深入","slug":"深入","link":"#深入","children":[{"level":3,"title":"Object.assign()对象的拷贝","slug":"object-assign-对象的拷贝","link":"#object-assign-对象的拷贝","children":[]}]},{"level":2,"title":"最后","slug":"最后","link":"#最后","children":[]}],"git":{"createdTime":1668049671000,"updatedTime":1668491882000,"contributors":[{"name":"init-qy","email":"953218204@qq.com","commits":2},{"name":"qinye","email":"953218204@qq.com","commits":1}]},"readingTime":{"minutes":2.92,"words":875},"filePathRelative":"posts/mpvue使用过程中的一个问题.md","localizedDate":"2020年11月27日","excerpt":"<h2> 前言</h2>\\n<p>虽然说都快 1202 年了，还在使用 mpvue 可能已经跟不上时代。但是 mpvue 仍然是我认为写小程序前端最靠近 vue 写法的框架，而且从使用情况来看，即使已经两年没有更新，使用 mpvue 框架编写小程序前端依然没有什么致命的问题，我觉得只要小程序的主要框架不发生大的改变，mpvue 的使用就没有太大的问题。\\n从移动端前端的发展来看，小程序的出现是革命性的。最主要的是小程序不仅提供了较为简单的开发环境，<strong>降低了开发成本</strong>；同时提供了国民级软件（如微信）的<strong>用户信息</strong>。这点尤为重要：app 的构建太过沉重，用户量的累积也过于漫长，这点限制了规模较小商户的会员体系构建，而小程序解决了这个问题，并同时为双方创造收益，商户获得了用户流量入口，微信也可以借此扩大自身的影响。</p>","autoDesc":true}');export{e as data};
