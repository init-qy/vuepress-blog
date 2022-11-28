const e=JSON.parse('{"key":"v-0b753cb9","path":"/en/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html","title":"关于监听浏览器窗口大小的一些记录","lang":"en-US","frontmatter":{"title":"关于监听浏览器窗口大小的一些记录","date":"2021-01-27T17:34:36.000Z","tag":["js","vue"],"category":["前端开发"],"description":"过程 由于需要在 vue 项目中使用 echarts 图表，基于 canvas 的 echarts 不能随窗口大小改变而改变。这时就需要监听窗口大小，并实时执行 echarts 的 resize 方法。 向 Window 对象添加事件句柄 在 window 的 onresize 中挂载方法 这种方法略显臃肿，而且 data 里还需要额外维护两个变量 使...","head":[["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/en/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html"}],["meta",{"property":"og:site_name","content":"blog by init-qy"}],["meta",{"property":"og:title","content":"关于监听浏览器窗口大小的一些记录"}],["meta",{"property":"og:description","content":"过程 由于需要在 vue 项目中使用 echarts 图表，基于 canvas 的 echarts 不能随窗口大小改变而改变。这时就需要监听窗口大小，并实时执行 echarts 的 resize 方法。 向 Window 对象添加事件句柄 在 window 的 onresize 中挂载方法 这种方法略显臃肿，而且 data 里还需要额外维护两个变量 使..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-11-28T10:15:45.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"article:tag","content":"js"}],["meta",{"property":"article:tag","content":"vue"}],["meta",{"property":"article:published_time","content":"2021-01-27T17:34:36.000Z"}],["meta",{"property":"article:modified_time","content":"2022-11-28T10:15:45.000Z"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://init-qy.github.io/vuepress-blog/posts/%E5%85%B3%E4%BA%8E%E7%9B%91%E5%90%AC%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AA%97%E5%8F%A3%E5%A4%A7%E5%B0%8F%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%B0%E5%BD%95.html"}]]},"excerpt":"","headers":[{"level":2,"title":"过程","slug":"过程","link":"#过程","children":[{"level":3,"title":"向 Window 对象添加事件句柄","slug":"向-window-对象添加事件句柄","link":"#向-window-对象添加事件句柄","children":[]},{"level":3,"title":"在 window 的 onresize 中挂载方法","slug":"在-window-的-onresize-中挂载方法","link":"#在-window-的-onresize-中挂载方法","children":[]},{"level":3,"title":"使用 resize-observer-polyfill 监听 dom 大小变化","slug":"使用-resize-observer-polyfill-监听-dom-大小变化","link":"#使用-resize-observer-polyfill-监听-dom-大小变化","children":[]}]},{"level":2,"title":"整理","slug":"整理","link":"#整理","children":[]}],"git":{"createdTime":1669630545000,"updatedTime":1669630545000,"contributors":[{"name":"init-qy","email":"953218204@qq.com","commits":1}]},"readingTime":{"minutes":1.85,"words":556},"filePathRelative":"en/posts/关于监听浏览器窗口大小的一些记录.md","localizedDate":"January 27, 2021"}');export{e as data};
