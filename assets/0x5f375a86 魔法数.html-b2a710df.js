import{_ as o,r as i,o as c,c as l,a as e,b as n,d as s,e as t}from"./app-c1fb5501.js";const r={},p=e("p",null,[n("By chance, I came across this magical hexadecimal number "),e("code",null,"0x5f3759df"),n(" and decided to make a note of it.")],-1),d=e("blockquote",null,[e("p",null,"Science changes the world, and mathematics changes science.")],-1),u=e("p",null,[n("Last time, I encountered an irrational number, "),e("code",null,"0.75"),n(", which appeared in the source code of Java HashMap and represents the default load factor. Let me briefly explain the meaning of this value: when the number of elements in the HashMap reaches 0.75 times its capacity (i.e., 12 elements when the capacity is 16), the HashMap will be resized to reduce hash collisions and avoid the degradation of HashMap into a linked list, which significantly increases the query time. As for why this value is 0.75, there is a simple explanation: it is a compromise between improving space utilization and reducing query costs, mainly based on the Poisson distribution, and 0.75 minimizes collisions.")],-1),h=e("code",null,"0x5f3759df",-1),m={href:"https://www.zhihu.com/question/26287650?sort=created",title:"What is the mathematical basis of the constant `0x5f3759df` in the fast inverse square root algorithm?",target:"_blank",rel:"noopener noreferrer"},k=e("code",null,"0x5f3759df",-1),f={href:"http://h14s.p5r.org/2012/09/0x5f3759df.html",title:"The mathematical principle behind `0x5f3759df` - A fast inverse square root algorithm",target:"_blank",rel:"noopener noreferrer"},b=e("code",null,"0x5f3759df",-1),v={href:"https://blog.csdn.net/zdy0_2004/article/details/52477640",title:"The Beauty of Mathematics: The magical number `0x5f3759df` in the fast inverse square root algorithm",target:"_blank",rel:"noopener noreferrer"},g=e("code",null,"0x5f3759df",-1),y=t(`<blockquote><p>Quake-III Arena is one of the classic games of the 90s.<br> Not only does this series have great graphics and content, but it also runs extremely smoothly even on low-end computers. This is thanks to the developer of its 3D engine, John Carmack. In fact, as early as the DOS era in the early 90s, when even a small animation on a PC could amaze people, John Carmack released the groundbreaking Castle Wolfstein, and then continued to innovate with doom, doomII, Quake... each time pushing 3-D technology to the limit. His 3D engine code is extremely efficient, squeezing every computational instruction of the PC. Even MS had to listen to his opinions and made many modifications to Direct3D.</p></blockquote><p>This magical number appears in the underlying code of this 3D engine, and its purpose is to calculate the square root of a number and take its reciprocal. Tests have shown that this code is 4 times faster than <code>(float)(1.0/sqrt(x))</code>:</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">float</span> <span class="token function">Q_rsqrt</span><span class="token punctuation">(</span> <span class="token keyword">float</span> number <span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">long</span> i<span class="token punctuation">;</span>
    <span class="token keyword">float</span> x2<span class="token punctuation">,</span> y<span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token keyword">float</span> threehalfs <span class="token operator">=</span> <span class="token number">1.5F</span><span class="token punctuation">;</span>

    x2 <span class="token operator">=</span> number <span class="token operator">*</span> <span class="token number">0.5F</span><span class="token punctuation">;</span>
    y  <span class="token operator">=</span> number<span class="token punctuation">;</span>
    i  <span class="token operator">=</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">long</span> <span class="token operator">*</span> <span class="token punctuation">)</span> <span class="token operator">&amp;</span>y<span class="token punctuation">;</span>                       <span class="token comment">// evil floating point bit level hacking</span>
    i  <span class="token operator">=</span> <span class="token number">0x5f3759df</span> <span class="token operator">-</span> <span class="token punctuation">(</span> i <span class="token operator">&gt;&gt;</span> <span class="token number">1</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>               <span class="token comment">// what the fuck?</span>
    y  <span class="token operator">=</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">float</span> <span class="token operator">*</span> <span class="token punctuation">)</span> <span class="token operator">&amp;</span>i<span class="token punctuation">;</span>
    y  <span class="token operator">=</span> y <span class="token operator">*</span> <span class="token punctuation">(</span> threehalfs <span class="token operator">-</span> <span class="token punctuation">(</span> x2 <span class="token operator">*</span> y <span class="token operator">*</span> y <span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// 1st iteration</span>
<span class="token comment">//  y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">Q3_VM</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifdef</span> <span class="token expression">__linux__</span></span>
    <span class="token function">assert</span><span class="token punctuation">(</span> <span class="token operator">!</span><span class="token function">isnan</span><span class="token punctuation">(</span>y<span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// bk010122 - FPE?</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
    <span class="token keyword">return</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="about-iterative-method" tabindex="-1"><a class="header-anchor" href="#about-iterative-method" aria-hidden="true">#</a> About Iterative Method</h5><p>The iterative method calculates new values based on old values, repeating the process, which is very suitable for computer languages.<br> The most classic iterative algorithm is the Euclidean algorithm (also known as the Euclidean division algorithm), which is used to calculate the greatest common divisor of two integers, a and b. Its calculation principle relies on the following theorem:</p><blockquote><p>gcd(a,b) = gcd(b,a mod b)</p></blockquote><p>In addition to this, common examples like the Fibonacci sequence can also be calculated using the iterative method. Generally speaking, recursive algorithms have good readability but often require more overhead. In such cases, recursion can be converted into iteration to achieve higher efficiency. I have deeply felt this when solving algorithm problems.</p><h5 id="about-newton-s-iteration-method" tabindex="-1"><a class="header-anchor" href="#about-newton-s-iteration-method" aria-hidden="true">#</a> About Newton&#39;s Iteration Method</h5>`,8),_={href:"https://baike.baidu.com/item/%E7%89%9B%E9%A1%BF%E8%BF%AD%E4%BB%A3%E6%B3%95/10887580?fr=aladdin",title:"Newton's Iteration Method - Baidu Baike",target:"_blank",rel:"noopener noreferrer"},x=e("br",null,null,-1),w=e("br",null,null,-1),q=e("code",null,"f(x) = a",-1),I=e("code",null,"x - f(x)/f'(x)",-1),T=t("<p>To put it simply, when calculating the square root, <code>f(x) = x^2 = a</code>, <code>f&#39;(x) = 2*x</code>, and <code>f(x)/f&#39;(x) = x/2</code>. Substituting <code>f(x)</code> into <code>x - f(x)/f&#39;(x)</code>, we get <code>(x + a/x)/2</code>. Now let&#39;s choose a = 5 and an initial guess of 2. We can calculate as follows:</p><ol><li><p>5/2 = 2.5; (2.5 + 2)/2 = 2.25;</p></li><li><p>5/2.25 = 2.22; (2.25+2.22)/2 = 2.235;</p></li><li><p>5/2.235 = 2.23713; (2.235+2.23713)/2 = 2.236065;</p></li></ol><p>In just three steps, the value we obtained is very close to sqrt(5) = 2.23606797. It can be foreseen that by repeating this process, the result will converge to sqrt(5). Generally, after iterating 4 to 7 times, a relatively accurate value can be obtained. This is based on the assumption that the initial guess is relatively inaccurate. In theory, as long as the initial guess is accurate enough, the number of iterations can be greatly reduced. This is where the number <code>0x5f3759df</code> comes into play.</p><p>For the specific derivation process, you can refer to the blog mentioned above. Here, I would like to quote the conclusion at the end, which also arouses my curiosity about game engines.</p><p><em>So magical, so strange, so contrary to common sense, so in line with common sense, so beautiful.</em></p><blockquote><p>We have delved deep enough, at least I am satisfied, and there is nothing more to explore. Through this exercise, I have mainly learned that the bitwise conversion operations between integers and floating-point numbers are not meaningless. They are peculiar but economical numerical operations that are useful in calculations. I believe there are still more undiscovered uses for them.</p></blockquote>",6),B={href:"https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new",target:"_blank",rel:"noopener noreferrer"},M=e("strong",null,"feedback",-1);function E(N,D){const a=i("ExternalLinkIcon");return c(),l("div",null,[p,d,u,e("p",null,[n("Well, I can accept this explanation and the value of 0.75, but I simply cannot imagine how "),h,n(" is derived. Here is some background information and source code introduction about this magic number, partly quoted from a post on Zhihu: "),e("a",m,[n("What is the mathematical basis of the constant "),k,n(" in the fast inverse square root algorithm?"),s(a)]),n(", and another blog post: "),e("a",f,[n("The mathematical principle behind "),b,s(a)]),n("; you can also read the Chinese version here: "),e("a",v,[n("The Beauty of Mathematics: The magical number "),g,n(" in the fast inverse square root algorithm"),s(a)]),n(".")]),y,e("p",null,[n("Introduction: "),e("a",_,[n("Newton's Iteration Method - Baidu Baike"),s(a)]),x,n(" The idea from 300 years ago still shines today. Mathematics is indeed the cornerstone of civilization."),w,n(" The general sqrt algorithm uses Newton's iteration method, which continuously approximates the root of "),q,n(" using "),I,n(".")]),T,e("blockquote",null,[e("p",null,[n("This post is translated using ChatGPT, please "),e("a",B,[M,s(a)]),n(" if any omissions.")])])])}const A=o(r,[["render",E],["__file","0x5f375a86 魔法数.html.vue"]]);export{A as default};
