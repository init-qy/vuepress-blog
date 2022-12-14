---
title: 关于js异步编程的一点研究
date: 2021-01-05 11:19:21
tag: ["js"]
category: ["前端开发"]
---

## 前言

最近在看阮老师的[JavaScript 基础和 es6 文档](https://wangdoc.com/)，其中关于异步的处理，我觉得有必要整理一下。这有助于我逐步改善自己的编程风格，提升代码质量。

## Promise

文档传送门：[Promise 对象](https://wangdoc.com/es6/promise.html "Promise 对象")
promise 已经是现如今最广泛使用的异步解决方案，几乎已经没有人去使用回调来解决异步问题。callback 最广为人知的问题是回调地狱，因此 promise 应运而生。然鹅，promise 的链式调用也没有从根本上解决这个问题，.then()的调用只是换了一种写法；同时，promise 的错误处理也是一个大麻烦。
**Promise.all()**

> Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
const p = Promise.all([p1, p2, p3]);
```

上面代码中，Promise.all()方法接受一个数组作为参数，p1、p2、p3 都是 Promise 实例，如果不是，就会先调用下面讲到的 Promise.resolve 方法，将参数转为 Promise 实例，再进一步处理。另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
p 的状态由 p1、p2、p3 决定，分成两种情况。
（1）只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。
（2）只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数。

先来看个例子：

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

这个方法可以应用在多个 http 需要同时请求时的情况。需要注意的是，这时的错误处理需要分情况处理：如果原 Promise 实例有自己的 catch 处理，则不会触发 all 的 catch，反之会触发 all 的 catch
**Promise.race()**
这个方法与 all 类似，区别是只要有一个 Promise 先改变了状态（resolve，reject 皆可），就会传回回调。这个方法暂时没有想到什么应用方向（感觉它与高并发的秒杀业务流程类似）
**Promise.any()**
Promise.any()跟 Promise.race()方法很像，只有一点不同，就是不会因为某个 Promise 变成 rejected 状态而结束。
这是 es2021 引入的新方法。~~谨慎使用~~

## async/await

文档传送门：[async 函数](https://wangdoc.com/es6/async.html "async 函数")

> async 函数是什么？一句话，它就是 Generator 函数的语法糖。

文档中提到了 Generator 函数，这个函数我粗略的看了一下，它的异步应用似乎只是它延伸出的应用而已，本身是实现了函数的分步执行。在有了 async/await 之后，似乎并不需要它来实现异步了。参考：[ES6+中的 Generator 函数有何特别之处？](https://www.zhihu.com/question/290681846 "ES6+中的Generator 函数有何特别之处？")

### 基本使用

作为一个语法糖，可以将上述代码简化：

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

sleep()函数也可以用 async/await 写法，除了写法不同，实际运行效果一样：

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

### 错误处理

如果使用多个 await 处理异步函数，在前一个函数返回 reject 时，之后不会执行。为了防止出错，需要将其放在 try...catch 代码块之中。
一个文档中的使用例子，可以实现多次重复尝试。

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

## 持续学习

关于 js 的异步编程，我自认还没有完全了解，只是了解了写法和部分原理，只有持续学习，看看在实际应用中还是否会遇上问题。

_几篇不错的文章（可能会更新）：_

1. [100 行代码实现 Promises/A+ 规范](https://zhuanlan.zhihu.com/p/83965949 "100 行代码实现 Promises/A+ 规范")
2. [小哥哥小姐姐，来尝尝 Async 函数这块语法糖](https://zhuanlan.zhihu.com/p/42649246 "小哥哥小姐姐，来尝尝 Async 函数这块语法糖")
