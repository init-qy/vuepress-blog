import{_ as t,r as o,o as c,c as p,a as n,b as s,d as e,e as l}from"./app-8d6eda64.js";const i={},r=l(`<p><code>Unity</code> 本身提供了<code>WebcamDevice</code>, <code>WebcamTexture</code>这样的接口来支持对物理相机的访问，但是这些接口支持获取的参数太少了，因此需要我们在<code>Unity</code>中调用原生的函数获取相应的参数。</p><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境" aria-hidden="true">#</a> 环境</h2><p>因为<code>Android</code>或<code>Unity</code>版本变更很快，这里贴一下目前的环境：</p><ul><li>Unity 2021.3.19f1</li><li>Android 12.0 API31 emulator</li></ul><h2 id="用法" tabindex="-1"><a class="header-anchor" href="#用法" aria-hidden="true">#</a> 用法</h2><p>以下代码是使用安卓<code>CameraCharacteristics</code>类获取可用<code>focal_length</code>和<code>sensor_info_physical_size</code>的例子。</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token class-name"><span class="token keyword">var</span></span> player <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token constructor-invocation class-name">AndroidJavaClass</span><span class="token punctuation">(</span><span class="token string">&quot;com.unity3d.player.UnityPlayer&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> activity <span class="token operator">=</span> player<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetStatic</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;currentActivity&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name"><span class="token keyword">var</span></span> cameraManager <span class="token operator">=</span> activity<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Call</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;getSystemService&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;camera&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>cameraManager <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name"><span class="token keyword">var</span></span> CameraCharacteristics <span class="token operator">=</span> cameraManager<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Call</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;getCameraCharacteristics&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;0&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// device id</span>

    <span class="token class-name">AndroidJavaObject</span> key_focal_lens <span class="token operator">=</span> CameraCharacteristics<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetStatic</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;LENS_INFO_AVAILABLE_FOCAL_LENGTHS&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">AndroidJavaObject</span> key_sensor_size <span class="token operator">=</span> CameraCharacteristics<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">GetStatic</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;SENSOR_INFO_PHYSICAL_SIZE&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name"><span class="token keyword">float</span><span class="token punctuation">[</span><span class="token punctuation">]</span></span> focal_lens <span class="token operator">=</span> CameraCharacteristics<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Call</span><span class="token generic class-name"><span class="token punctuation">&lt;</span><span class="token keyword">float</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;get&quot;</span><span class="token punctuation">,</span> key_focal_lens<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">AndroidJavaObject</span> sensor_size <span class="token operator">=</span> CameraCharacteristics<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Call</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>AndroidJavaObject<span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;get&quot;</span><span class="token punctuation">,</span> key_sensor_size<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name"><span class="token keyword">float</span></span> sensor_width <span class="token operator">=</span> sensor_size<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Call</span><span class="token generic class-name"><span class="token punctuation">&lt;</span><span class="token keyword">float</span><span class="token punctuation">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;getWidth&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>其中，如果是调用一个类中的方法，就使用<code>Call</code>，第一个参数为方法名，第二个参数可选，是传递的参数。<br> 如果传参过程中需要用到它本来的类，比如上述代码中的<code>Key</code>，需要用<code>AndroidJavaObject</code>包装，只有一些基本类型(<code>int</code>, <code>float[]</code>)可以直接传递。<br> 如果是调用一个类中的成员(fields)，则使用<code>GetStatic</code>，比如<code>java</code>中的<code>CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS</code>就可以用<code>GetStatic</code>获取。</p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>`,10),u={href:"https://github.com/ricoh-live-streaming-api/android-sdk-samples/blob/main/unity-samples/unity-app/Assets/Scripts/CameraInfoList.cs",target:"_blank",rel:"noopener noreferrer"},d={href:"https://github.com/huailiang/WebCam",target:"_blank",rel:"noopener noreferrer"},k={href:"https://developer.android.com/reference/android/hardware/camera2/package-summary.html",target:"_blank",rel:"noopener noreferrer"};function m(h,g){const a=o("ExternalLinkIcon");return c(),p("div",null,[r,n("ul",null,[n("li",null,[n("a",u,[s("https://github.com/ricoh-live-streaming-api/android-sdk-samples/blob/main/unity-samples/unity-app/Assets/Scripts/CameraInfoList.cs"),e(a)])]),n("li",null,[n("a",d,[s("https://github.com/huailiang/WebCam"),e(a)])]),n("li",null,[n("a",k,[s("https://developer.android.com/reference/android/hardware/camera2/package-summary.html"),e(a)])])])])}const _=t(i,[["render",m],["__file","unity中调用安卓camera函数.html.vue"]]);export{_ as default};
