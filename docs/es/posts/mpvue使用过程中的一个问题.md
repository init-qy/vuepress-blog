---
title: Un problema durante el uso de mpvue.
date: 2020-11-27 20:48:08
tag:
  - mini-app
  - mpvue
category:
  - desarrollo front-end
---

## Introducción

Aunque ya estamos en el año 2020, el uso de mpvue puede que ya no esté a la vanguardia. Sin embargo, todavía considero que mpvue es el framework que más se acerca a la forma de escribir en Vue para el desarrollo de la parte frontal de las miniaplicaciones. Además, según mi experiencia, aunque no se ha actualizado en dos años, no hay problemas graves al utilizar mpvue para desarrollar la parte frontal de las miniaplicaciones, siempre y cuando el framework principal de las miniaplicaciones no sufra cambios importantes.

Desde la perspectiva del desarrollo de la parte frontal en dispositivos móviles, la aparición de las miniaplicaciones ha sido revolucionaria. Lo más importante es que las miniaplicaciones no solo proporcionan un entorno de desarrollo más sencillo, lo cual **reduce los costos de desarrollo**, sino que también ofrecen información de los usuarios de aplicaciones de nivel nacional (como WeChat). Esto es especialmente importante: la construcción de una aplicación es demasiado pesada y la acumulación de usuarios lleva mucho tiempo, lo cual limita la construcción de sistemas de membresía para pequeños comerciantes. Sin embargo, las miniaplicaciones resuelven este problema y, al mismo tiempo, generan beneficios para ambas partes: los comerciantes obtienen acceso al flujo de usuarios y WeChat puede ampliar su influencia.

## Problema

Debido al ciclo de vida de mpvue, no es completamente equivalente al ciclo de vida de las miniaplicaciones. Al cambiar de página, es fácil notar un problema: los contenidos que se completaron en el formulario de la página anterior todavía están presentes y las ventanas emergentes de la página anterior no se han ocultado debido a la destrucción de la página... Al revisar los registros, se descubre que los valores no se han restablecido, por lo que se actualizan los valores en el método `onLoad`. ¿Uno está bien, pero qué pasa si hay muchos?
Es tedioso asignar los valores uno por uno, pero afortunadamente, este problema se puede resolver con una sola línea de código:
`Object.assign(this.$data, this.$options.data())`
Al agregar esta línea de código en los métodos `onLoad` o `onUnload`, los datos volverán a su valor inicial.

## En profundidad

Este problema se debe a que mpvue utiliza la misma instancia en la misma página y no se destruye cuando se llama al método `onUnload` de las miniaplicaciones. Los detalles del problema se explican claramente en [github/mpvue/issue_140](https://github.com/Meituan-Dianping/mpvue/issues/140 "github/mpvue/issue_140") y hay muchas soluciones propuestas.

### Copia de objetos con Object.assign()

**Uso básico**
El método Object.assign se utiliza para combinar objetos, copiando todas las propiedades enumerables del objeto fuente (source) al objeto destino (target).
En cuanto al primer nivel, este método realiza una copia profunda, pero para niveles más profundos, realiza una copia superficial.

`Object.assign()` me recuerda al operador de propagación (`...`) de ES6, y resulta que su implementación es casi la misma:

> La especificación de object spread establece claramente que `{… obj}` es equivalente a `Object.assign({}, obj)`.

Sin embargo, hay una pequeña diferencia entre los dos. Si cambio `Object.assign(this.$data, this.$options.data())` por `this.$data = {...this.$options.data()}`, se producirá un error:

> TypeError: Cannot set property "prop" of #Object which has only a getter (Chrome)

Para obtener más información, consulta [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only)

Se puede entender como que la entidad de Java no tiene un setter y las propiedades son de solo lectura.

~~Solo quiero comentar sobre el mensaje de error, ¿por qué se llama "solo tiene un getter" en lugar de "no tiene un setter"? ¿No sería más claro de esta manera?~~

La diferencia clave entre ellos es que la función `Object.assign()` modifica directamente el primer objeto que se pasa como argumento, mientras que el operador de propagación (`...`) se utiliza más como una operación de asignación, por lo que activa los setters.

## Conclusión

Para mantener el código conciso y legible, es mejor utilizar el operador de propagación (`...`), pero también hay casos en los que no se puede utilizar, por lo que no debemos olvidar que existe la función `Object.assign()` como alternativa.

~~Vaya, esa línea de error causó un problema en el análisis del Markdown. Lo más sorprendente es que no puedo mostrarla aquí...~~

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
