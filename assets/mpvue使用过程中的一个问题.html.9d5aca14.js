import{_ as r,L as n,M as c,N as t,a8 as e,U as s,a9 as o,A as d}from"./framework.6d211372.js";const i={},p=o('<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>虽然说都快 1202 年了，还在使用 mpvue 可能已经跟不上时代。但是 mpvue 仍然是我认为写小程序前端最靠近 vue 写法的框架，而且从使用情况来看，即使已经两年没有更新，使用 mpvue 框架编写小程序前端依然没有什么致命的问题，我觉得只要小程序的主要框架不发生大的改变，mpvue 的使用就没有太大的问题。 从移动端前端的发展来看，小程序的出现是革命性的。最主要的是小程序不仅提供了较为简单的开发环境，<strong>降低了开发成本</strong>；同时提供了国民级软件（如微信）的<strong>用户信息</strong>。这点尤为重要：app 的构建太过沉重，用户量的累积也过于漫长，这点限制了规模较小商户的会员体系构建，而小程序解决了这个问题，并同时为双方创造收益，商户获得了用户流量入口，微信也可以借此扩大自身的影响。</p><h2 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h2><p>由于 mpvue 的生命周期，它并不完全等同与小程序的生命周期，在页面切换的时候很容易发现一个问题：之前页面表单填写的内容还在，之前页面的弹窗还没有因为页面销毁而隐藏。。。然后打 log 一看，原来是值没有重置，于是就在 onLoad 里更新了一下值。一个还好，一堆呢？ 一个一个赋值太麻烦了，好在这个问题一行代码就能搞定 <code>Object.assign(this.$data, this.$options.data())</code> 在 onLoad 或在 onUnload 方法加上这行代码就能让 data 恢复初始值</p><h2 id="深入" tabindex="-1"><a class="header-anchor" href="#深入" aria-hidden="true">#</a> 深入</h2>',5),h={href:"https://github.com/Meituan-Dianping/mpvue/issues/140",title:"github/mpvue/issue_140",target:"_blank",rel:"noopener noreferrer"},l=o('<h3 id="object-assign-对象的拷贝" tabindex="-1"><a class="header-anchor" href="#object-assign-对象的拷贝" aria-hidden="true">#</a> Object.assign()对象的拷贝</h3><p><strong>基本用法</strong> Object.assign 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target） 同时对于第一级，这个方法是深拷贝，而对于更深的层次则是浅拷贝</p><p><code>Object.assign()</code>这个方法让我想起的 es6 中的扩展运算符（...），这两者的实现近乎相同，果然：</p><blockquote><p>object spread spec 明确指出<code>{… obj}</code>等同于<code>Object.assign（{}，obj）</code>。</p></blockquote><p>这两者还是有一点区别的，如果我将<code>Object.assign(this.$data, this.$options.data())</code>改为<code>this.$data = {...this.$options.data()}</code>，会报错</p><blockquote><p>TypeError: Cannot set property &quot;prop&quot; of #Object which has only a getter (Chrome)</p></blockquote>',6),_={href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only",target:"_blank",rel:"noopener noreferrer"},u=o('<p>可以理解为 Java 实体没有 setter，属性只读。</p><p><s>吐槽一下报错信息，为什么要叫只有一个 getter，而不叫没有 setter，这样不是更清楚吗</s></p><p>其中关键的区别是：<code>Object.assign()</code>函数是直接修改其第一个传入对象 obj，而扩展运算符（...）的使用更像是一个赋值操作，因此会触发 setter。</p><h2 id="最后" tabindex="-1"><a class="header-anchor" href="#最后" aria-hidden="true">#</a> 最后</h2><p>为了代码的简洁和易读性，使用扩展运算符（...）更好，但是也有无法使用的情况，这时不要忘记还有一个<code>Object.assign()</code>函数可以代替。</p><p><s>好家伙，报错那行有导致 md 解析出问题的字符,更骚的是我不能在这行打出来...</s></p>',6);function b(g,m){const a=d("ExternalLinkIcon");return n(),c("div",null,[p,t("p",null,[e("这个问题的出现源于 mpvue 在相同页面时共用一个实例，并且在小程序 onUnload 时并未销毁。具体问题在"),t("a",h,[e("github/mpvue/issue_140"),s(a)]),e("中解释的很清楚，解决方案也有很多。")]),l,t("p",null,[e("具体参考 "),t("a",_,[e("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only"),s(a)])]),u])}const f=r(i,[["render",b],["__file","mpvue使用过程中的一个问题.html.vue"]]);export{f as default};
