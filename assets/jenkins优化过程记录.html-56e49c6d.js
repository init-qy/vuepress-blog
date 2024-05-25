import{_ as t,r as l,o as d,c as o,a as e,b as n,d as i,e as a}from"./app-a56f3296.js";const r={},c=a(`<h2 id="background" tabindex="-1"><a class="header-anchor" href="#background" aria-hidden="true">#</a> Background</h2><p>This is a record of my entire process of optimizing Jenkins. The project being deployed is a frontend project, using Node 14, Vue 2, and npm for packaging. It also requires packaging Nginx as a Docker image and deploying it.</p><h2 id="version-1-30-minutes" tabindex="-1"><a class="header-anchor" href="#version-1-30-minutes" aria-hidden="true">#</a> Version 1 (30 minutes)</h2><p>This version was quite outrageous. When I took over, I was excited to hear about the automated deployment pipeline. However, after enduring it for two months, I couldn&#39;t take it anymore. The 30-minute deployment time meant that some issues that needed to be tested online couldn&#39;t be seen in a timely manner. Sometimes, if the first deployment failed, it would take another hour to start over.</p><p>After examining the duration of each step, I found that the most time-consuming part was the &quot;push to harbor&quot; image push, which took more than 20 minutes each time. There are two possible reasons for this: network issues or image issues.</p><p>In this case, it was the latter. I found that the size of an image was about 1GB, which is why the Jenkins server&#39;s hard drive was constantly filling up every few days. In fact, the size of the frontend image package was only about 30MB. The reason the image package was so large was because it included the <code>node_modules</code> directory 😓.</p><p>The solution was to add a <code>.dockerignore</code> file to exclude unnecessary directories.</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># Ignore everything</span>
**
<span class="token comment"># Allow files and directories</span>
!dist
!Dockerfile
!ssl
!default.conf
!nginx.conf
!nginx_reconfigure.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>With this change, the packaging time was reduced to 3-5 minutes.</p><h2 id="version-2-10-minutes" tabindex="-1"><a class="header-anchor" href="#version-2-10-minutes" aria-hidden="true">#</a> Version 2 (10 minutes)</h2><p>Later, as the business expanded, a new repository was added, and now the goal was to package A and B together and then package them into an image.</p><p>Because of the urgency, I didn&#39;t think too much and made the changes directly in the pipeline.</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>agent {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>With this change, the functionality was roughly implemented, but the packaging time was noticeably longer.</p><h2 id="version-3-3-4-minutes" tabindex="-1"><a class="header-anchor" href="#version-3-3-4-minutes" aria-hidden="true">#</a> Version 3 (3-4 minutes)</h2><p>After the business stabilized, I further optimized the 10-minute duration by using parallel builds.</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>parallel {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>One thing to note is <code>reuseNode true</code>. If not set, Jenkins will automatically create a new workspace, and files cannot be transferred between the two workspaces.</p>`,18),u={href:"https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization",target:"_blank",rel:"noopener noreferrer"},m=a(`<p>After that, I made some optimizations to <code>npm install</code>. If <code>package.json</code> is not changed, there is no need to run <code>npm install</code> again.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>    <span class="token comment"># file exit or not</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion" aria-hidden="true">#</a> Conclusion</h2>`,3),p=e("li",null,"Optimization is an ongoing process. Jenkins might be replaced one day.",-1),v={href:"https://www.jenkins.io/doc/book/",target:"_blank",rel:"noopener noreferrer"},h=e("code",null,"reuseNode true",-1),b={href:"https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new",target:"_blank",rel:"noopener noreferrer"},g=e("strong",null,"feedback",-1);function k(f,w){const s=l("ExternalLinkIcon");return d(),o("div",null,[c,e("p",null,[n("Refer to "),e("a",u,[n("https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization"),i(s)])]),m,e("ol",null,[p,e("li",null,[n("Prioritize referring to the "),e("a",v,[n("official documentation"),i(s)]),n(" and look for the section on "),h,n(", as it can be time-consuming.")])]),e("blockquote",null,[e("p",null,[n("This post is translated using ChatGPT, please "),e("a",b,[g,i(s)]),n(" if any omissions.")])])])}const y=t(r,[["render",k],["__file","jenkins优化过程记录.html.vue"]]);export{y as default};
