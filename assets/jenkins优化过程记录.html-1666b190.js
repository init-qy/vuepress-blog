const e=JSON.parse('{"key":"v-fce444da","path":"/en/posts/jenkins%E4%BC%98%E5%8C%96%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95.html","title":"Jenkins优化过程记录","lang":"en-US","frontmatter":{"title":"Jenkins优化过程记录","date":"2022-11-21T15:23:16.000Z","tag":["Jenkins"],"category":["DevOps"],"description":"背景 仅此记录下我的 Jenkins 优化全过程。部署项目是一个前端项目，node14，vue2，使用 npm 打包，需要将 nginx 同时打包为一个 docker 镜像并部署。 第一版(30min) 这一版相当离谱，我接手的时候听说有自动化部署流水线还十分兴奋，但是忍了两个月后实在是受不了。长达 30 分钟的部署时长意味着有些需要线上测试的问题不能及时看到效果，有时第一次部署失败的话又需要一个小时起步。 在对每一个步骤查看时长后，我发现最耗时的部分竟然是push to harbor推送镜像的部分，每一次推送时长竟然都达到了 20+分钟，这里有两种可能：网络问题或者镜像问题。","head":[["link",{"rel":"canonical","href":"https://init-qy.github.io/vuepress-blog/en/posts/jenkins%E4%BC%98%E5%8C%96%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95.html"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://init-qy.github.io/vuepress-blog/posts/jenkins%E4%BC%98%E5%8C%96%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95.html"}],["meta",{"property":"og:url","content":"https://init-qy.github.io/vuepress-blog/en/posts/jenkins%E4%BC%98%E5%8C%96%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95.html"}],["meta",{"property":"og:site_name","content":"blog by init-qy"}],["meta",{"property":"og:title","content":"Jenkins优化过程记录"}],["meta",{"property":"og:description","content":"背景 仅此记录下我的 Jenkins 优化全过程。部署项目是一个前端项目，node14，vue2，使用 npm 打包，需要将 nginx 同时打包为一个 docker 镜像并部署。 第一版(30min) 这一版相当离谱，我接手的时候听说有自动化部署流水线还十分兴奋，但是忍了两个月后实在是受不了。长达 30 分钟的部署时长意味着有些需要线上测试的问题不能及时看到效果，有时第一次部署失败的话又需要一个小时起步。 在对每一个步骤查看时长后，我发现最耗时的部分竟然是push to harbor推送镜像的部分，每一次推送时长竟然都达到了 20+分钟，这里有两种可能：网络问题或者镜像问题。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2022-11-30T06:25:01.000Z"}],["meta",{"property":"article:author","content":"init-qy"}],["meta",{"property":"article:tag","content":"Jenkins"}],["meta",{"property":"article:published_time","content":"2022-11-21T15:23:16.000Z"}],["meta",{"property":"article:modified_time","content":"2022-11-30T06:25:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Jenkins优化过程记录\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-11-21T15:23:16.000Z\\",\\"dateModified\\":\\"2022-11-30T06:25:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"init-qy\\",\\"url\\":\\"https://github.com/init-qy\\"}]}"]]},"headers":[{"level":2,"title":"背景","slug":"背景","link":"#背景","children":[]},{"level":2,"title":"第一版(30min)","slug":"第一版-30min","link":"#第一版-30min","children":[]},{"level":2,"title":"第二版(10min)","slug":"第二版-10min","link":"#第二版-10min","children":[]},{"level":2,"title":"第三版(3~4min)","slug":"第三版-3-4min","link":"#第三版-3-4min","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1669019738000,"updatedTime":1669789501000,"contributors":[{"name":"init-qy","email":"953218204@qq.com","commits":3}]},"readingTime":{"minutes":2.58,"words":775},"filePathRelative":"en/posts/jenkins优化过程记录.md","localizedDate":"November 21, 2022","excerpt":"<h2> 背景</h2>\\n<p>仅此记录下我的 Jenkins 优化全过程。部署项目是一个前端项目，node14，vue2，使用 npm 打包，需要将 nginx 同时打包为一个 docker 镜像并部署。</p>\\n<h2> 第一版(30min)</h2>\\n<p>这一版相当离谱，我接手的时候听说有自动化部署流水线还十分兴奋，但是忍了两个月后实在是受不了。长达 30 分钟的部署时长意味着有些需要线上测试的问题不能及时看到效果，有时第一次部署失败的话又需要一个小时起步。</p>\\n<p>在对每一个步骤查看时长后，我发现最耗时的部分竟然是<code>push to harbor</code>推送镜像的部分，每一次推送时长竟然都达到了 20+分钟，这里有两种可能：网络问题或者镜像问题。</p>","autoDesc":true}');export{e as data};
