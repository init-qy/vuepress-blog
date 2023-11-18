import{_ as l,r as d,o,c as r,a as e,b as n,d as a,e as i}from"./app-23f68ebc.js";const c={},t=i(`<h2 id="background" tabindex="-1"><a class="header-anchor" href="#background" aria-hidden="true">#</a> Background</h2><p>Aquí registro todo el proceso de optimización de mi Jenkins. El proyecto desplegado es un proyecto frontend, con node14, vue2, utilizando npm para empaquetar, y se necesita empaquetar también nginx en una imagen de Docker y desplegarlo.</p><h2 id="version-1-30-minutos" tabindex="-1"><a class="header-anchor" href="#version-1-30-minutos" aria-hidden="true">#</a> Versión 1 (30 minutos)</h2><p>Esta versión fue bastante absurda, cuando me hice cargo, me emocioné al escuchar que había un pipeline de despliegue automatizado, pero después de aguantar dos meses, ya no pude más. El tiempo de despliegue de 30 minutos significa que algunos problemas que necesitan ser probados en línea no se pueden ver de inmediato, y a veces, si el primer despliegue falla, se necesita otra hora para comenzar de nuevo.</p><p>Después de revisar la duración de cada paso, descubrí que la parte que más tiempo consume es la de &quot;push to harbor&quot;, cada vez que se realiza el push, lleva más de 20 minutos. Hay dos posibilidades aquí: un problema de red o un problema con la imagen.</p><p>En este caso, es lo último, descubrí que el tamaño de la imagen era de aproximadamente 1 GB, supongo que esta es una de las razones por las que el disco del servidor de Jenkins se llena constantemente. De hecho, el tamaño del paquete de la imagen frontend es solo de alrededor de 30 MB, la razón por la que el paquete de la imagen es tan grande es porque también incluye <code>node_modules</code> 😓.</p><p>La solución es agregar un archivo <code>.dockerignore</code> para excluir los directorios innecesarios.</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># Ignore everything</span>
**
<span class="token comment"># Allow files and directories</span>
!dist
!Dockerfile
!ssl
!default.conf
!nginx.conf
!nginx_reconfigure.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Con esto, el tiempo de empaquetado se redujo a 3-5 minutos.</p><h2 id="version-2-10-minutos" tabindex="-1"><a class="header-anchor" href="#version-2-10-minutos" aria-hidden="true">#</a> Versión 2 (10 minutos)</h2><p>Luego, con la expansión del negocio, se agregó un nuevo repositorio y ahora se necesita empaquetar A y B juntos en una imagen.</p><p>Debido a la urgencia, no pensé demasiado y realicé la modificación directamente en el pipeline.</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>agent {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>De esta manera, se implementó aproximadamente esta funcionalidad, pero el tiempo de empaquetado obviamente se incrementó.</p><h2 id="version-3-3-4-minutos" tabindex="-1"><a class="header-anchor" href="#version-3-3-4-minutos" aria-hidden="true">#</a> Versión 3 (3-4 minutos)</h2><p>Después de que el negocio se estabilizó, optimicé aún más el tiempo de 10 minutos utilizando la construcción en paralelo.</p><div class="language-pipeline line-numbers-mode" data-ext="pipeline"><pre class="language-pipeline"><code>parallel {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Es importante tener en cuenta <code>reuseNode true</code>, si no se establece, Jenkins creará automáticamente un nuevo espacio de trabajo y los archivos no se pueden transferir entre los dos espacios de trabajo.</p>`,18),u={href:"https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization",target:"_blank",rel:"noopener noreferrer"},m=i(`<p>Luego, realicé algunas optimizaciones en <code>npm install</code>, cuando no se cambia <code>package.json</code>, en realidad no es necesario ejecutar <code>npm install</code> nuevamente.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>    <span class="token comment"># file exit or not</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="conclusiones" tabindex="-1"><a class="header-anchor" href="#conclusiones" aria-hidden="true">#</a> Conclusiones</h2>`,3),p=e("li",null,"La optimización es un proceso continuo, quién sabe si algún día Jenkins se retirará del entorno.",-1),v={href:"https://www.jenkins.io/doc/book/",target:"_blank",rel:"noopener noreferrer"},b=e("code",null,"reuseNode true",-1),h={href:"https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new",target:"_blank",rel:"noopener noreferrer"},g=e("strong",null,"feedback",-1);function k(f,_){const s=d("ExternalLinkIcon");return o(),r("div",null,[t,e("p",null,[n("Consultar "),e("a",u,[n("https://www.jenkins.io/doc/book/pipeline/docker/#workspace-synchronization"),a(s)])]),m,e("ol",null,[p,e("li",null,[n("Prioriza consultar la "),e("a",v,[n("documentación oficial"),a(s)]),n(", busca la sección de "),b,n(" que es la que más tiempo consume.")])]),e("blockquote",null,[e("p",null,[n("Este post está traducido usando ChatGPT, por favor "),e("a",h,[g,a(s)]),n(" si hay alguna omisión.")])])])}const x=l(c,[["render",k],["__file","jenkins优化过程记录.html.vue"]]);export{x as default};
