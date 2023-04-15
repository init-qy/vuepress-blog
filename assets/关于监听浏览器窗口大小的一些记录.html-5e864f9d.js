const e=JSON.parse(`{"key":"v-0b753cb9","path":"/en/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html","title":"关于监听浏览器窗口大小的一些记录","lang":"en-US","frontmatter":{"title":"关于监听浏览器窗口大小的一些记录","date":"2021-01-27T17:34:36.000Z","tag":["js","vue"],"category":["前端开发"],"description":"过程 由于需要在 vue 项目中使用 echarts 图表，基于 canvas 的 echarts 不能随窗口大小改变而改变。这时就需要监听窗口大小，并实时执行 echarts 的 resize 方法。 向 Window 对象添加事件句柄 mounted() { window.addEventListener('resize', this.resizeHandler) }, destroyed() { window.removeEventListener('resize', this.resizeHandler) }, methods:{ resizeHandler(){ // do something } }","head":[["link",{"rel":"canonical","href":"https://init-qy.github.io/vuepress-blog/en/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://init-qy.github.io/vuepress-blog/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html"}],["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/en/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html"}],["meta",{"property":"og:site_name","content":"blog by init-qy"}],["meta",{"property":"og:title","content":"关于监听浏览器窗口大小的一些记录"}],["meta",{"property":"og:description","content":"过程 由于需要在 vue 项目中使用 echarts 图表，基于 canvas 的 echarts 不能随窗口大小改变而改变。这时就需要监听窗口大小，并实时执行 echarts 的 resize 方法。 向 Window 对象添加事件句柄 mounted() { window.addEventListener('resize', this.resizeHandler) }, destroyed() { window.removeEventListener('resize', this.resizeHandler) }, methods:{ resizeHandler(){ // do something } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2022-12-16T02:13:44.000Z"}],["meta",{"property":"article:author","content":"init-qy"}],["meta",{"property":"article:tag","content":"js"}],["meta",{"property":"article:tag","content":"vue"}],["meta",{"property":"article:published_time","content":"2021-01-27T17:34:36.000Z"}],["meta",{"property":"article:modified_time","content":"2022-12-16T02:13:44.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"关于监听浏览器窗口大小的一些记录\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-01-27T17:34:36.000Z\\",\\"dateModified\\":\\"2022-12-16T02:13:44.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"init-qy\\",\\"url\\":\\"https://github.com/init-qy\\"}]}"]]},"headers":[{"level":2,"title":"过程","slug":"过程","link":"#过程","children":[{"level":3,"title":"向 Window 对象添加事件句柄","slug":"向-window-对象添加事件句柄","link":"#向-window-对象添加事件句柄","children":[]},{"level":3,"title":"在 window 的 onresize 中挂载方法","slug":"在-window-的-onresize-中挂载方法","link":"#在-window-的-onresize-中挂载方法","children":[]},{"level":3,"title":"使用 resize-observer-polyfill 监听 dom 大小变化","slug":"使用-resize-observer-polyfill-监听-dom-大小变化","link":"#使用-resize-observer-polyfill-监听-dom-大小变化","children":[]},{"level":3,"title":"使用 vueuse 中的 useresizeobserver(2022-12-15)","slug":"使用-vueuse-中的-useresizeobserver-2022-12-15","link":"#使用-vueuse-中的-useresizeobserver-2022-12-15","children":[]}]},{"level":2,"title":"整理","slug":"整理","link":"#整理","children":[]}],"git":{"createdTime":1668049671000,"updatedTime":1671156824000,"contributors":[{"name":"init-qy","email":"953218204@qq.com","commits":3},{"name":"qinye","email":"953218204@qq.com","commits":1}]},"readingTime":{"minutes":1.98,"words":595},"filePathRelative":"en/posts/关于监听浏览器窗口大小的一些记录.md","localizedDate":"January 27, 2021","excerpt":"<h2> 过程</h2>\\n<p>由于需要在 vue 项目中使用 echarts 图表，基于 canvas 的 echarts 不能随窗口大小改变而改变。这时就需要监听窗口大小，并实时执行 echarts 的 resize 方法。</p>\\n<h3> 向 Window 对象添加事件句柄</h3>\\n<div class=\\"language-vue line-numbers-mode\\" data-ext=\\"vue\\"><pre class=\\"language-vue\\"><code>mounted() { window.addEventListener('resize', this.resizeHandler) }, destroyed()\\n{ window.removeEventListener('resize', this.resizeHandler) }, methods:{\\nresizeHandler(){ // do something } }\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{e as data};
