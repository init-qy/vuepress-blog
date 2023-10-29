---
title: Un estudio sobre la programación asincrónica en JavaScript.
date: 2021-01-05 11:19:21
tag:
  - js
category:
  - desarrollo front-end
---

## Introduction

Recently, I've been reading [JavaScript Basics and ES6 Documentation](https://wangdoc.com/) by Teacher Ruan. I feel it's necessary to organize the section on asynchronous handling. This will help me gradually improve my programming style and enhance code quality.

## Promise

Documentation link: [Promise Objects](https://wangdoc.com/es6/promise.html "Promise Objects")

Promise is currently the most widely used solution for handling asynchronous operations. Almost no one uses callbacks to solve asynchronous problems anymore. The most well-known problem with callbacks is callback hell, which is why promises came into existence. However, the chaining of promises does not fundamentally solve this problem; the use of `.then()` is just a different way of writing. Additionally, error handling with promises can be quite troublesome.

### Promise.all()

> The Promise.all() method is used to wrap multiple Promise instances into a new Promise instance.

```js
const p = Promise.all([p1, p2, p3]);
```

In the above code, the Promise.all() method accepts an array as its parameter. p1, p2, and p3 are all Promise instances. If they are not, the Promise.resolve method, which will be discussed below, is called to convert the parameters into Promise instances before further processing. Additionally, the parameter of the Promise.all() method does not have to be an array, but it must have the Iterator interface, and each member it returns must be a Promise instance.
The state of p is determined by p1, p2, and p3, and there are two scenarios:
(1) Only when the states of p1, p2, and p3 are all fulfilled will the state of p become fulfilled. At this time, the return values of p1, p2, and p3 will be combined into an array and passed to the callback function of p.
(2) If any of p1, p2, or p3 is rejected, the state of p will become rejected. At this time, the return value of the first rejected instance will be passed to the callback function of p.

Let's take a look at an example:

```js
function sleep(t) {
  console.log(t);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(t + "运行结束");
      resolve();
    }, t);
  });
}
// 这时我需要调用sleep两次,这两次调用需要同时进行,并在两次调用都返回值后打印总运行时间
function f() {
  const start = new Date().getTime();
  Promise.all([sleep(2000), sleep(1000)]).then((res) => {
    const end = new Date().getTime();
    const time = (end - start) / 1000;
    console.log("总共运行时间为" + time);
  });
}
f();
// > 2000
// > 1000
// > "1000运行结束"
// > "2000运行结束"
// > "总共运行时间为2.001"
```

This method can be applied in situations where multiple HTTP requests need to be made simultaneously. It is important to note that error handling in this case needs to be handled differently: if the original Promise instance has its own catch handling, the catch of all will not be triggered, but if not, the catch of all will be triggered.

### Promise.race()

This method is similar to all, but the difference is that as long as one Promise changes its state first (either resolve or reject), the callback will be triggered. I haven't thought of any specific applications for this method yet (it seems similar to the high-concurrency process of flash sales).

### Promise.any()

Promise.any() is similar to Promise.race(), with one difference: it does not end when one Promise becomes rejected.
This is a new method introduced in ES2021. ~~Use with caution~~

## async/await

Documentation link: [async function](https://wangdoc.com/es6/async.html "async function")

> What is an async function? In short, it is syntactic sugar for Generator functions.

The documentation mentions Generator functions, which I briefly looked at. It seems that their asynchronous applications are just extensions, as they are primarily used for step-by-step execution of functions. With the introduction of async/await, it seems that there is no longer a need for them to handle asynchronous operations. Reference: [What are the special features of Generator functions in ES6+?](https://www.zhihu.com/question/290681846 "What are the special features of Generator functions in ES6+?")

### Basic Usage

As syntactic sugar, the above code can be simplified as follows:

```js
async function f() {
  const start = new Date().getTime();
  // 少了.then()的链式调用，代码清晰了不少
  await Promise.all([sleep(2000), sleep(1000)]);
  const end = new Date().getTime();
  const time = (end - start) / 1000;
  console.log("总共运行时间为" + time);
}
```

The sleep() function can also be written using async/await syntax. Apart from the different syntax, the actual execution results are the same:

```js
async function sleep(t) {
  console.log(t);
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(t + "运行结束");
      resolve();
    }, t);
  });
}
```

### Error Handling

When using multiple await statements to handle asynchronous functions, if the previous function returns a reject, the subsequent statements will not be executed. To prevent errors, they need to be placed within a try...catch block.
Here's an example from the documentation that demonstrates multiple retry attempts.

```js
const superagent = require("superagent");
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get("http://google.com/this-throws-an-error");
      break;
    } catch (err) {}
  }
  console.log(i); // 3
}

test();
```

## Continuous Learning

Sobre la programación asíncrona en JavaScript, reconozco que aún no la entiendo completamente, solo conozco la sintaxis y parte de los principios. Solo a través del aprendizaje continuo podré ver si encuentro problemas al aplicarla en situaciones reales.

_Aquí hay algunos artículos interesantes (puede que se actualicen):_

1. [Implementación de la especificación Promises/A+ en 100 líneas de código](https://zhuanlan.zhihu.com/p/83965949 "Implementación de la especificación Promises/A+ en 100 líneas de código")
2. [Explorando la sintaxis azucarada de las funciones Async](https://zhuanlan.zhihu.com/p/42649246 "Explorando la sintaxis azucarada de las funciones Async")

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
