import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as p,a as n,b as s,d as t,e as c,r as i}from"./app.bd831ef3.js";const l={},u=n("h1",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),s(" 前言")],-1),r={href:"http://www.ruanyifeng.com/blog/2014/10/event-loop.html",title:"JavaScript 运行机制详解：再谈Event Loop",target:"_blank",rel:"noopener noreferrer"},k=n("h1",{id:"event-loop",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#event-loop","aria-hidden":"true"},"#"),s(" Event Loop")],-1),d=n("blockquote",null,[n("p",null,'主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。')],-1),m={href:"https://zhuanlan.zhihu.com/p/25407758",title:"一道简单的面试题",target:"_blank",rel:"noopener noreferrer"},h=c(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">executor</span><span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    i <span class="token operator">==</span> <span class="token number">9999</span> <span class="token operator">&amp;&amp;</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码可以直接在浏览器中运行，其中打印的顺序为 2，3，5，4，1 js 是单线程的，执行的过程从上到下</p><ol><li>setTimeout 函数放入“任务队列”</li><li>promise 里函数直接执行，打印 2，resolve()不会影响后面代码执行，打印 3，then 里的函数会放在当前执行的最后</li><li>打印 5</li><li>来到当前函数下个循环之前，执行 then 里的函数，打印 4</li><li>setTimeout 函数已就绪，打印 1</li></ol><p>关于 setTimeout 函数有几点需要注意：</p><ul><li>最小执行时间根据浏览器有所不同，如果需要表现出先后执行顺序，最好设置在 16ms 以上</li><li>设置的时间不一定会精确，可能因为当前代码延迟出现不准的情况</li></ul><blockquote><p>需要注意的是，setTimeout()只是将事件插入了&quot;任务队列&quot;，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在 setTimeout()指定的时间执行。</p></blockquote><h1 id="vue-中的-nexttick" tabindex="-1"><a class="header-anchor" href="#vue-中的-nexttick" aria-hidden="true">#</a> vue 中的$nextTick</h1>`,7),v={href:"https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97",title:"异步更新队列",target:"_blank",rel:"noopener noreferrer"},_=n("blockquote",null,[n("p",null,"Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。")],-1),b=n("p",null,"如果$nextTick 使用原生的 Promise.then，那么它应该与 Promise.then 平级，执行顺序取决于代码的先后，事实上确实如此。 在 node.js 中也存在 process.nextTick 方法，不过因为不熟悉，暂且不表。",-1),f=n("h1",{id:"小程序中的-wx-nexttick",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#小程序中的-wx-nexttick","aria-hidden":"true"},"#"),s(" 小程序中的 wx.nextTick")],-1),x={href:"https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html",title:"wx.nextTick",target:"_blank",rel:"noopener noreferrer"},g=n("h1",{id:"最后",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#最后","aria-hidden":"true"},"#"),s(" 最后")],-1),w=n("p",null,"了解到这些可能不会真正意义上提高你的代码水平，它很少出现在日常的代码中。不过这些东西，知道就是知道，总会有 bug 和坑等待你的发现，到时候，说不定身边正好有一根绳子。",-1);function T(E,j){const a=i("ExternalLinkIcon");return o(),p("div",null,[u,n("p",null,[s("最近追了阮一峰阮老师的博客，真的是吾辈楷模。写博客不难，难得是一直写博客，一直保持学习、分享的精神。坚持是一件很难的事情，希望我能够坚持下去。言归正传，我是通过阮老师一篇据说被喷的博客（"),n("a",r,[s("JavaScript 运行机制详解：再谈 Event Loop"),t(a)]),s("）中去理解了一下，自己做了一点总结。")]),k,d,n("p",null,[s("先从一个简单的例子来说明 js 的这种机制："),n("a",m,[s("一道简单的面试题"),t(a)])]),h,n("p",null,[s("官方文档："),n("a",v,[s("异步更新队列"),t(a)])]),_,b,f,n("p",null,[s("官方文档："),n("a",x,[s("wx.nextTick"),t(a)]),s(" 小程序中还未接触过这个方法，但是在 vant-weapp 源码中存在。官方文档的解释比较模糊，但大致可以确定为下一个时间段(tick)执行。")]),g,w])}const B=e(l,[["render",T],["__file","关于js运行机制的一点研究.html.vue"]]);export{B as default};
