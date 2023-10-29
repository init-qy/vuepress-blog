import{_ as r,r as i,o as n,c as h,a as e,b as t,d as s,e as a}from"./app-c1fb5501.js";const c={},d=a('<h2 id="preface" tabindex="-1"><a class="header-anchor" href="#preface" aria-hidden="true">#</a> Preface</h2><p>Although it&#39;s almost 2020, using mpvue may seem outdated. However, mpvue is still the framework that I believe is closest to the Vue syntax for developing frontend of mini programs. From my experience, even though it hasn&#39;t been updated for two years, there are no major issues when using mpvue to develop the frontend of mini programs, as long as the main framework of mini programs doesn&#39;t undergo significant changes.</p><p>From the perspective of frontend development for mobile devices, the emergence of mini programs is revolutionary. The most important aspect is that mini programs not only provide a relatively simple development environment, reducing development costs, but also provide access to user information from popular apps like WeChat. This is particularly important: building an app is too heavy and accumulating a user base takes too long, which limits the ability of small-scale businesses to build a membership system. Mini programs solve this problem and create benefits for both parties, as merchants gain access to user traffic and WeChat can expand its influence.</p><h2 id="issue" tabindex="-1"><a class="header-anchor" href="#issue" aria-hidden="true">#</a> Issue</h2><p>Due to the lifecycle of mpvue, it is not exactly the same as the lifecycle of mini programs. When switching between pages, it is easy to notice a problem: the content filled in the form on the previous page is still there, and the pop-up window from the previous page has not been hidden due to the destruction of the page... After checking the log, it turns out that the values have not been reset. So I updated the values in the onLoad method. It&#39;s fine for one page, but what about a bunch of pages?<br> It&#39;s too cumbersome to assign values one by one, but fortunately, this problem can be solved with just one line of code:<br><code>Object.assign(this.$data, this.$options.data())</code><br> Adding this line of code in the onLoad or onUnload method will restore the data to its initial values.</p><h2 id="in-depth" tabindex="-1"><a class="header-anchor" href="#in-depth" aria-hidden="true">#</a> In-depth</h2>',6),p={href:"https://github.com/Meituan-Dianping/mpvue/issues/140",target:"_blank",rel:"noopener noreferrer"},l=a('<h3 id="object-assign-for-object-copying" tabindex="-1"><a class="header-anchor" href="#object-assign-for-object-copying" aria-hidden="true">#</a> Object.assign() for object copying</h3><p><strong>Basic usage</strong><br> The Object.assign method is used to merge objects, copying all enumerable properties from the source object to the target object.<br> For the first level, this method performs a deep copy, while for deeper levels, it performs a shallow copy.</p><p><code>Object.assign()</code> reminds me of the spread operator (...) in ES6, and their implementations are almost the same. As expected:</p><blockquote><p>The object spread spec explicitly states that <code>{...obj}</code> is equivalent to <code>Object.assign({}, obj)</code>.</p></blockquote><p>However, there is a slight difference between the two. If I change <code>Object.assign(this.$data, this.$options.data())</code> to <code>this.$data = {...this.$options.data()}</code>, it will throw an error:</p><blockquote><p>TypeError: Cannot set property &quot;prop&quot; of #Object which has only a getter (Chrome)</p></blockquote>',6),u={href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only",target:"_blank",rel:"noopener noreferrer"},m=a('<p>This can be understood as Java entities not having setters, making the properties read-only.</p><p><s>Let me complain about the error message for a moment. Why is it called &quot;only a getter&quot; instead of &quot;no setter&quot;? Isn&#39;t the latter clearer?</s></p><p>The key difference is that the <code>Object.assign()</code> function directly modifies the first passed object <code>obj</code>, while the spread operator (...) is more like an assignment operation, which triggers the setter.</p><h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion" aria-hidden="true">#</a> Conclusion</h2><p>For the sake of code simplicity and readability, the spread operator (...) is preferred. However, there may be cases where it cannot be used, so don&#39;t forget that there is an <code>Object.assign()</code> function that can be used as an alternative.</p><p><s>Wow, that line with the error caused issues with the markdown parsing. What&#39;s even more interesting is that I can&#39;t even print it out here...</s></p>',6),f={href:"https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new",target:"_blank",rel:"noopener noreferrer"},b=e("strong",null,"feedback",-1);function g(v,_){const o=i("ExternalLinkIcon");return n(),h("div",null,[d,e("p",null,[t("This problem arises because mpvue shares the same instance for the same page and does not destroy it when the mini program is unloaded. The specific problem is explained clearly in "),e("a",p,[t("github/mpvue/issue_140"),s(o)]),t(", and there are also many solutions.")]),l,e("p",null,[t("For more details, please refer to "),e("a",u,[t("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only"),s(o)])]),m,e("blockquote",null,[e("p",null,[t("This post is translated using ChatGPT, please "),e("a",f,[b,s(o)]),t(" if any omissions.")])])])}const w=r(c,[["render",g],["__file","mpvue使用过程中的一个问题.html.vue"]]);export{w as default};
