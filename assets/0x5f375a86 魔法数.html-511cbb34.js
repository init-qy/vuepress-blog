import{_ as t,r as i,o as c,c as r,a as e,b as a,d as s,e as o}from"./app-c1fb5501.js";const l={},p=e("p",null,[a("En una coincidencia fortuita, me encontré con este número hexadecimal mágico "),e("code",null,"0x5f3759df"),a(" y decidí tomar nota de ello.")],-1),d=e("blockquote",null,[e("p",null,"La ciencia cambia el mundo, las matemáticas cambian la ciencia.")],-1),u=e("p",null,[a("La última vez me encontré con un número irracional, "),e("code",null,"0.75"),a(", que aparece en el código fuente de Java HashMap y representa el factor de carga predeterminado. Permíteme explicarte brevemente el significado de este valor: cuando la capacidad de HashMap alcanza el 75% de su capacidad total (es decir, cuando hay 12 elementos en una capacidad de 16), se realiza una operación de redimensionamiento para reducir las colisiones de hash y evitar que HashMap se degrade a una lista enlazada, lo que aumentaría significativamente el tiempo de búsqueda. ¿Por qué se eligió el valor 0.75? La explicación es bastante simple: es un compromiso entre la utilización eficiente del espacio y la reducción de los costos de búsqueda, basado principalmente en la distribución de Poisson, y 0.75 minimiza las colisiones.")],-1),m=e("code",null,"0x5f3759df",-1),k={href:"https://www.zhihu.com/question/26287650?sort=created",title:"¿Cuál es la base matemática de la constante en el algoritmo de raíz cuadrada rápida 0x5f3759df?",target:"_blank",rel:"noopener noreferrer"},v={href:"http://h14s.p5r.org/2012/09/0x5f3759df.html",title:"Principios matemáticos de 0x5f3759df: un método rápido para calcular raíces cuadradas y recíprocas",target:"_blank",rel:"noopener noreferrer"},b={href:"https://blog.csdn.net/zdy0_2004/article/details/52477640",title:"La belleza de las matemáticas: el número mágico 0x5f3759df en el algoritmo de cálculo rápido de raíces cuadradas",target:"_blank",rel:"noopener noreferrer"},f=o(`<blockquote><p>Quake-III Arena es uno de los juegos clásicos de los años 90.<br> Esta serie de juegos no solo tiene buenos gráficos y contenido, sino que también se puede jugar de manera extremadamente fluida incluso en computadoras con una configuración baja. Esto se debe al desarrollador de su motor 3D, John Carmack. De hecho, en los primeros días de DOS en la década de 1990, cuando cualquier pequeña animación en una PC era asombrosa, John Carmack lanzó el sorprendente Castle Wolfstein, y luego continuó con doom, doomII, Quake... cada vez llevando la tecnología 3D al límite. Su código de motor 3D es extremadamente eficiente, aprovechando al máximo cada instrucción de cálculo de la PC. Incluso Microsoft tuvo que escuchar sus opiniones y realizar modificaciones en Direct3D.</p></blockquote><p>Este número mágico aparece en el código subyacente de este motor 3D y se utiliza para calcular la raíz cuadrada y su recíproco. Según las pruebas, este código es 4 veces más rápido que <code>(float)(1.0/sqrt(x))</code>:</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">float</span> <span class="token function">Q_rsqrt</span><span class="token punctuation">(</span> <span class="token keyword">float</span> number <span class="token punctuation">)</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="sobre-el-metodo-iterativo" tabindex="-1"><a class="header-anchor" href="#sobre-el-metodo-iterativo" aria-hidden="true">#</a> Sobre el método iterativo</h5><p>El método iterativo calcula nuevos valores a partir de los valores antiguos, repitiendo el proceso en un bucle, lo cual es muy adecuado para los lenguajes de programación. El algoritmo iterativo más clásico es el algoritmo de Euclides (algoritmo de división sucesiva), que se utiliza para calcular el máximo común divisor de dos números enteros a y b. Su principio de cálculo se basa en el siguiente teorema:</p><blockquote><p>mcd(a,b) = mcd(b,a mod b)</p></blockquote><p>Además, el método iterativo también se utiliza para calcular secuencias famosas como la serie de Fibonacci. Por lo general, los algoritmos recursivos son más legibles, pero a menudo requieren más recursos. En estos casos, se puede convertir la recursión en iteración para lograr una mayor eficiencia. Esto es algo que he experimentado profundamente al resolver problemas de algoritmos.</p><h5 id="sobre-el-metodo-de-newton-raphson" tabindex="-1"><a class="header-anchor" href="#sobre-el-metodo-de-newton-raphson" aria-hidden="true">#</a> Sobre el método de Newton-Raphson</h5>`,8),h={href:"https://es.wikipedia.org/wiki/M%C3%A9todo_de_Newton-Raphson",title:"Método de Newton-Raphson - Wikipedia",target:"_blank",rel:"noopener noreferrer"},g=e("br",null,null,-1),y=e("code",null,"x - f(x)/f'(x)",-1),_=e("code",null,"f(x) = a",-1),x=o("<p>En pocas palabras, para calcular la raíz cuadrada, se utiliza la función <code>f(x) = x^2 = a</code>, y su derivada <code>f&#39;(x) = 2*x</code>. Sustituyendo <code>f(x)</code> en <code>x - f(x)/f&#39;(x)</code>, obtenemos <code>(x + a/x)/2</code>. Ahora, si elegimos <code>a = 5</code> y suponemos un valor inicial, como 2, podemos hacer lo siguiente:</p><ol><li><p>5/2 = 2.5; (2.5 + 2)/2 = 2.25;</p></li><li><p>5/2.25 = 2.22;(2.25+2.22)/2 = 2.235;</p></li><li><p>5/2.235 = 2.23713;(2.235+2.23713)/2 = 2.236065;</p></li></ol><p>En tan solo tres pasos, obtenemos un valor muy cercano a sqrt(5) = 2.23606797. Podemos prever que al repetir este proceso de iteración, el resultado convergerá hacia sqrt(5). Por lo general, después de 4 a 7 iteraciones, se obtiene un valor relativamente preciso. Esto se basa en la suposición de que el valor inicial es relativamente impreciso. En teoría, si el valor inicial es lo suficientemente preciso, se puede reducir significativamente el número de iteraciones, y es aquí donde entra en juego el número <code>0x5f3759df</code>.</p><p>Puedes consultar el blog mencionado anteriormente para obtener detalles sobre el proceso de derivación. Aquí, citaré la conclusión al final del artículo, que también despertó mi curiosidad sobre los motores de juegos.</p><p><em>Tan sorprendente, tan extraño, tan contrario a la lógica, tan acorde con la lógica, tan hermoso.</em></p><blockquote><p>Hemos profundizado lo suficiente, al menos yo estoy satisfecho, no hay nada más que investigar. Para mí, a través de este ejercicio, he aprendido principalmente que las operaciones de conversión de bits entre enteros y flotantes no carecen de sentido, son operaciones numéricas extrañas pero económicas y muy útiles en cálculos. Creo que aún hay más usos por descubrir.</p></blockquote>",6),q={href:"https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new",target:"_blank",rel:"noopener noreferrer"},w=e("strong",null,"feedback",-1);function z(E,P){const n=i("ExternalLinkIcon");return c(),r("div",null,[p,d,u,e("p",null,[a("Bueno, puedo aceptar esta explicación y también puedo aceptar el valor 0.75, pero no puedo imaginar cómo se obtuvo este "),m,a(", es algo completamente incomprensible para mí. A continuación, se presenta un poco de información de fondo y una introducción al código de este número mágico, citado en parte de Zhihu: "),e("a",k,[a("¿Cuál es la base matemática de la constante en el algoritmo de raíz cuadrada rápida 0x5f3759df?"),s(n)]),a(" y otro blog: "),e("a",v,[a("Principios matemáticos de 0x5f3759df"),s(n)]),a("; puedes leer la versión en chino aquí: "),e("a",b,[a("La belleza de las matemáticas: el número mágico 0x5f3759df en el algoritmo de cálculo rápido de raíces cuadradas"),s(n)]),a(".")]),f,e("p",null,[a("Introducción: "),e("a",h,[a("Método de Newton-Raphson - Wikipedia"),s(n)]),g,a(" Es sorprendente que una idea que surgió hace 300 años siga siendo relevante hoy en día. Las matemáticas realmente son el fundamento de la civilización. Por lo general, el algoritmo de la raíz cuadrada utiliza el método de Newton-Raphson, que se basa en la fórmula "),y,a(" para acercarse continuamente a la raíz de "),_,a(".")]),x,e("blockquote",null,[e("p",null,[a("Este post está traducido usando ChatGPT, por favor "),e("a",q,[w,s(n)]),a(" si hay alguna omisión.")])])])}const D=t(l,[["render",z],["__file","0x5f375a86 魔法数.html.vue"]]);export{D as default};
