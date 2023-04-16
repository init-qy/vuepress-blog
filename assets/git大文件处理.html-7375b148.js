import{_ as t,N as i,O as r,P as a,a8 as e,W as n,a9 as l,C as o}from"./framework-86e13fda.js";const p={},c=l(`<h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>最近在开发<code>flutter+unity</code>的手机 app 项目，因为第一次开发<code>unity</code>，并不是很了解<code>unity</code>的文件目录，有很多测试用资产(Assets)中的 3d 模型文件也被放进了<code>git</code>中，这就造成了<code>git</code>仓库的庞大。</p><p>其实这种资产管理用<code>svn</code>处理会更好，毕竟包含了大量图片，音频及二进制文件，但目前项目很小，用<code>git</code>管理也还好。</p><h2 id="步骤" tabindex="-1"><a class="header-anchor" href="#步骤" aria-hidden="true">#</a> 步骤</h2><ol><li><p>查看 git 仓库大小</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> count-objects <span class="token parameter variable">-vH</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>查看有哪些大文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> rev-list <span class="token parameter variable">--objects</span> <span class="token parameter variable">--all</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> verify-pack <span class="token parameter variable">-v</span> .git/objects/pack/*.idx <span class="token operator">|</span> <span class="token function">sort</span> <span class="token parameter variable">-k</span> <span class="token number">3</span> <span class="token parameter variable">-n</span> <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-10</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print$1}&#39;</span><span class="token variable">)</span></span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>从 git 所有分支历史中删除该文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> filter-branch <span class="token parameter variable">--force</span> --index-filter <span class="token string">&#39;git rm -rf --cached --ignore-unmatch &lt;bigfile&gt;&#39;</span> --prune-empty --tag-name-filter <span class="token function">cat</span> -- <span class="token parameter variable">--all</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>回收本地空间</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">rm</span> <span class="token parameter variable">-rf</span> .git/refs/original/
<span class="token function">git</span> reflog expire <span class="token parameter variable">--expire</span><span class="token operator">=</span>now <span class="token parameter variable">--all</span>
<span class="token function">git</span> gc <span class="token parameter variable">--prune</span><span class="token operator">=</span>now
<span class="token function">git</span> gc <span class="token parameter variable">--aggressive</span> <span class="token parameter variable">--prune</span><span class="token operator">=</span>now
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>推送到远端仓库</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> push origin <span class="token parameter variable">--force</span> <span class="token parameter variable">--all</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ol><h2 id="其他" tabindex="-1"><a class="header-anchor" href="#其他" aria-hidden="true">#</a> 其他</h2><p>在上述步骤执行完毕并推送到远端后，有时会发现远端的 git 仓库不仅没有变小，甚至变大了，这是因为远端的<code>git</code>仓库没有 gc。</p>`,7),d=a("code",null,"GitLab",-1),u=a("code",null,"GitLab",-1),v={href:"https://docs.gitlab.com/ee/administration/housekeeping.html#running-housekeeping-tasks",target:"_blank",rel:"noopener noreferrer"},g=a("code",null,"Housekeeping",-1),b={href:"https://juejin.cn/post/7024922528514572302",target:"_blank",rel:"noopener noreferrer"};function k(h,m){const s=o("ExternalLinkIcon");return i(),r("div",null,[c,a("p",null,[e("我使用的是公司内部的"),d,e("，仅以此为例，可以使用"),u,e("的"),a("a",v,[g,n(s)]),e("功能即可。")]),a("p",null,[e("更多详情可以参考"),a("a",b,[e("这篇文章"),n(s)])])])}const _=t(p,[["render",k],["__file","git大文件处理.html.vue"]]);export{_ as default};
