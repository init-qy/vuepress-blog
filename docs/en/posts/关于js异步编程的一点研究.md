---
title: A Brief Study on Asynchronous Programming in JavaScript
date: 2021-01-05 11:19:21
tag:
  - js
category:
  - front-end development
---

## Introduction

Recently, I have been reading [JavaScript Basics and ES6 Documentation](https://wangdoc.com/) by Teacher Ruan. I feel it is necessary to organize the content related to asynchronous handling. This will help me gradually improve my programming style and enhance the quality of my code.

## Promise

Documentation link: [Promise Object](https://wangdoc.com/es6/promise.html "Promise Object")

Promise is currently the most widely used solution for asynchronous operations, and almost no one uses callbacks to solve asynchronous problems anymore. The most well-known problem with callbacks is callback hell, which is why Promise was born. However, the chaining of Promise calls does not fundamentally solve this problem; the use of `.then()` is just a different way of writing. At the same time, error handling with Promise can also be quite troublesome.

### Promise.all()

> The `Promise.all()` method is used to wrap multiple Promise instances into a new Promise instance.

```js
const p = Promise.all([p1, p2, p3]);
```

In the above code, the `Promise.all()` method accepts an array as a parameter. `p1`, `p2`, and `p3` are all Promise instances. If they are not, the `Promise.resolve` method mentioned below will be called first to convert the parameters into Promise instances before further processing. In addition, the parameter of the `Promise.all()` method does not have to be an array, but it must have the Iterator interface, and each member returned must be a Promise instance.
The state of `p` is determined by `p1`, `p2`, and `p3`, and there are two scenarios.
(1) Only when the states of `p1`, `p2`, and `p3` are all fulfilled, the state of `p` will become fulfilled. At this time, the return values of `p1`, `p2`, and `p3` will be combined into an array and passed to the callback function of `p`.
(2) As long as one of `p1`, `p2`, and `p3` is rejected, the state of `p` will become rejected. At this time, the return value of the first rejected instance will be passed to the callback function of `p`.

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

This method can be applied in the case of simultaneous requests for multiple HTTP. It should be noted that error handling in this case needs to be handled differently: if the original Promise instance has its own catch handling, the catch of `all` will not be triggered, otherwise, the catch of `all` will be triggered.

### Promise.race()

This method is similar to `all`, but the difference is that as long as one Promise changes its state first (either resolve or reject), the callback will be passed. I haven't thought of any specific application direction for this method yet (it seems similar to the high-concurrency process of flash sales).

### Promise.any()

`Promise.any()` is similar to `Promise.race()`, with one difference: it does not end because one Promise becomes rejected.
This is a new method introduced in ES2021. ~~Use with caution~~

## async/await

Documentation link: [async function](https://wangdoc.com/es6/async.html "async function")

> What is an async function? In short, it is the syntax sugar of a Generator function.

The documentation mentions Generator functions, which I briefly looked at. Its asynchronous application seems to be just an extension of its application, and it itself implements the step-by-step execution of functions. With async/await, it seems that there is no need to use it to implement asynchronous operations. Reference: [What are the special features of Generator functions in ES6+?](https://www.zhihu.com/question/290681846 "What are the special features of Generator functions in ES6+?")

### Basic Usage

As syntax sugar, the above code can be simplified as follows:

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

The `sleep()` function can also be written using the async/await syntax. Apart from the different syntax, the actual execution effect is the same:

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

If multiple async functions are used with await, the subsequent functions will not be executed when the previous function returns a reject. To prevent errors, they need to be placed within a try...catch block.
Here is an example from the documentation that demonstrates multiple retry attempts.

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

Regarding asynchronous programming in JavaScript, I admit that I still don't fully understand it. I only know the syntax and some principles. I need to continue learning and see if I encounter any problems in practical applications.

_Some good articles (may be updated):_

1. [Implementing Promises/A+ Specification in 100 Lines of Code](https://zhuanlan.zhihu.com/p/83965949 "Implementing Promises/A+ Specification in 100 Lines of Code")
2. [Hey guys, try out this syntactic sugar called Async Functions](https://zhuanlan.zhihu.com/p/42649246 "Hey guys, try out this syntactic sugar called Async Functions")

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
