import{_ as l,N as d,O as r,P as n,a7 as e,W as i,a8 as a,F as c}from"./framework-42fba37a.js";const o={},t=a(`<h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>仅此记录下我的 Jenkins 优化全过程。部署项目是一个前端项目，node14，vue2，使用 npm 打包，需要将 nginx 同时打包为一个 docker 镜像并部署。</p><h2 id="第一版-30min" tabindex="-1"><a class="header-anchor" href="#第一版-30min" aria-hidden="true">#</a> 第一版(30min)</h2><p>这一版相当离谱，我接手的时候听说有自动化部署流水线还十分兴奋，但是忍了两个月后实在是受不了。长达 30 分钟的部署时长意味着有些需要线上测试的问题不能及时看到效果，有时第一次部署失败的话又需要一个小时起步。</p><p>在对每一个步骤查看时长后，我发现最耗时的部分竟然是<code>push to harbor</code>推送镜像的部分，每一次推送时长竟然都达到了 20+分钟，这里有两种可能：网络问题或者镜像问题。</p><p>这里的情况是后者，我发现一次镜像的大小竟然达到了大约 1G，我想这也是为什么 Jenkins 服务器三天两头硬盘占满的原因之一。事实上，前端镜像打包出来的大小只有 30M 左右，镜像包如此之大的原因是因为它把<code>node_modules</code>也放了进去 😓。</p><p>解决方法是加个<code>.dockerignore</code>文件，去除不需要的目录</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># Ignore everything</span>
**
<span class="token comment"># Allow files and directories</span>
!dist
!Dockerfile
!ssl
!default.conf
!nginx.conf
!nginx_reconfigure.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如此，打包时长来到了 3~5 分钟</p><h2 id="第二版-10min" tabindex="-1"><a class="header-anchor" href="#第二版-10min" aria-hidden="true">#</a> 第二版(10min)</h2><p>后来随着业务的扩展，新加了一个 repo 进来，现在需要实现的是一次打包 A 和 B，然后将其打包为镜像。</p><p>因为比较着急，没有过多思考，直接在 pipeline 中修改。</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>agent {
    docker {
        image &#39;node:14.19.1-stretch-slim&#39;
        args &#39;-p 3001:3000&#39;
    }
}
steps {
    git(url: env.burl, branch: &#39;master&#39;)
    sh &#39;npm install&#39;
    sh &#39;npm run build&#39;
    sh &#39;rm -rf node_modules&#39;
    git(url: env.url, branch: &#39;master&#39;)
    sh &#39;npm install&#39;
    sh &#39;npm run build&#39;
    sh &#39;mv b dist&#39;
    sh &#39;rm -rf node_modules&#39;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如此大致实现了这个功能，但是打包时长明显更长。</p><h2 id="第三版-3-4min" tabindex="-1"><a class="header-anchor" href="#第三版-3-4min" aria-hidden="true">#</a> 第三版(3~4min)</h2><p>在业务稳定下来后，针对 10 分钟的时长我又进一步做了优化，使用 parallel 进行并发构建。</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>parallel {
    stage(&#39;main&#39;) {
        agent {
            docker {
                image &#39;node:14.19.1-stretch-slim&#39;
                reuseNode true
            }
        }
        steps {
            git(url: env.url, branch: &#39;master&#39;)
            sh &#39;npm install&#39;
            sh &#39;npm run build&#39;
        }
    }
    stage(&#39;skywalking-ui&#39;) {
        agent {
            docker {
                image &#39;node:14.19.1-stretch-slim&#39;
                reuseNode true
            }
        }
        steps {
            checkout([
                $class: &#39;GitSCM&#39;,
                branches: [[name: &#39;master&#39;]],
                userRemoteConfigs: [[url: env.burl]],
                extensions: [[
                    $class: &#39;RelativeTargetDirectory&#39;,
                    relativeTargetDir: &#39;b&#39;
                ]]
            ])
            dir(&#39;b&#39;) {
                sh &#39;npm install&#39;
                sh &#39;npm run build&#39;
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中必须要注意的是<code>reuseNode true</code>，如果不设置，Jenkins 会自动创建新的工作区，两个工作区之间无法相互传输文件。</p>`,18),v={href:"https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization",target:"_blank",rel:"noopener noreferrer"},u=a(`<p>之后我又对<code>npm install</code>进行了一些优化，在未改变<code>package.json</code>时，其实无需重新<code>npm install</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>    <span class="token comment"># file exit or not</span>
    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;package.json.md5&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token keyword">then</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;file does not exist&quot;</span>
        <span class="token function">npm</span> <span class="token function">install</span>
        md5sum package.json<span class="token operator">&gt;</span>package.json.md5
    <span class="token keyword">else</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;file already exists&quot;</span>
    <span class="token keyword">fi</span>

    <span class="token comment"># Check whether the md5sum has changed</span>
    if<span class="token punctuation">(</span>md5sum <span class="token parameter variable">-c</span> <span class="token parameter variable">--status</span> package.json.md5<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token keyword">then</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;md5 no changed&quot;</span>
    <span class="token keyword">else</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;md5 changed&quot;</span>
        <span class="token function">npm</span> <span class="token function">install</span>
        md5sum package.json<span class="token operator">&gt;</span>package.json.md5
    <span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>`,3),p=n("li",null,"优化是持续的过程，说不定哪天 Jenkins 就退环境了。",-1),m={href:"https://www.jenkins.io/doc/book/",target:"_blank",rel:"noopener noreferrer"},b=n("code",null,"reuseNode true",-1);function h(k,g){const s=c("ExternalLinkIcon");return d(),r("div",null,[t,n("p",null,[e("Refer to "),n("a",v,[e("https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization"),i(s)])]),u,n("ol",null,[p,n("li",null,[e("优先看"),n("a",m,[e("官方文档"),i(s)]),e("，寻找"),b,e("那段最耗费时间。")])])])}const _=l(o,[["render",h],["__file","jenkins优化过程记录.html.vue"]]);export{_ as default};
