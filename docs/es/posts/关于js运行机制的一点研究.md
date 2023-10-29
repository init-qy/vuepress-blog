---
title: Un breve estudio sobre el mecanismo de ejecución de JavaScript.
date: 2020-12-25 17:38:48
tag:
  - js
  - vue
category:
  - desarrollo front-end
---

## Introducción

Recientemente he estado siguiendo el blog del profesor Ruan Yifeng, realmente es un modelo a seguir. Es fácil escribir un blog, lo difícil es seguir escribiendo un blog y mantener el espíritu de aprendizaje y compartir. La perseverancia es algo difícil, espero poder seguir adelante. Volviendo al tema, a través de un blog del profesor Ruan que supuestamente fue criticado ([Explicación detallada del mecanismo de ejecución de JavaScript: volviendo a hablar del Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html "Explicación detallada del mecanismo de ejecución de JavaScript: volviendo a hablar del Event Loop")), pude entender un poco y hacer un resumen por mi cuenta.

## Event Loop

> El hilo principal lee eventos de la "cola de tareas", este proceso es cíclico, por lo que este mecanismo de ejecución se conoce como Event Loop (bucle de eventos).

Comencemos con un ejemplo simple para explicar este mecanismo de JavaScript: [Una pregunta simple de entrevista](https://zhuanlan.zhihu.com/p/25407758 "Una pregunta simple de entrevista")

```javascript
setTimeout(function () {
  console.log(1);
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for (var i = 0; i < 10000; i++) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function () {
  console.log(4);
});
console.log(5);
```

Este código se puede ejecutar directamente en el navegador, y el orden de impresión es 2, 3, 5, 4, 1. JavaScript es de un solo hilo, el proceso de ejecución es de arriba hacia abajo.

1. La función setTimeout se coloca en la "cola de tareas".
2. La función dentro de la promesa se ejecuta directamente, imprime 2. La función resolve() no afecta la ejecución del código posterior, imprime 3. La función dentro de then se coloca al final de la ejecución actual.
3. Imprime 5.
4. Antes de pasar al siguiente ciclo de la función actual, se ejecuta la función dentro de then, imprime 4.
5. La función setTimeout está lista, imprime 1.

Hay algunas cosas que debemos tener en cuenta sobre la función setTimeout:

- El tiempo mínimo de ejecución varía según el navegador, si se desea mostrar el orden de ejecución, es mejor establecerlo en más de 16 ms.
- El tiempo establecido no siempre es preciso, puede haber imprecisiones debido a retrasos en el código actual.

> Es importante tener en cuenta que setTimeout() solo inserta el evento en la "cola de tareas", y el hilo principal solo ejecutará la función de devolución de llamada especificada después de que el código actual (pila de ejecución) se haya completado. Si el código actual tarda mucho tiempo en ejecutarse, es posible que deba esperar mucho tiempo, por lo que no se puede garantizar que la función de devolución de llamada se ejecute exactamente en el tiempo especificado por setTimeout().

## $nextTick en Vue

Documentación oficial: [Cola de actualización asíncrona](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97 "Cola de actualización asíncrona")

> Vue intenta utilizar Promise.then, MutationObserver y setImmediate nativos para la cola asíncrona en su implementación interna. Si el entorno de ejecución no los admite, se utilizará setTimeout(fn, 0) como alternativa.

Si $nextTick utiliza Promise.then nativo, entonces debería estar al mismo nivel que Promise.then, el orden de ejecución depende del orden del código, y de hecho es así.
En Node.js también existe el método process.nextTick, pero como no estoy familiarizado con él, no lo mencionaré por ahora.

## wx.nextTick en mini programas

Documentación oficial: [wx.nextTick](https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html "wx.nextTick")
Aún no he utilizado este método en mini programas, pero existe en el código fuente de vant-weapp. La explicación en la documentación oficial es un poco vaga, pero en general se puede determinar que se ejecutará en el siguiente intervalo de tiempo (tick).

## Conclusión

Saber todo esto puede que no mejore realmente tu nivel de código, rara vez se encuentra en el código diario. Sin embargo, saber estas cosas es saber, siempre habrá errores y problemas esperando a ser descubiertos, y en ese momento, tal vez haya una cuerda a tu alrededor.

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
