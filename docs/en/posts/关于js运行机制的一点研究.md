---
title: A Brief Study on the Execution Mechanism of JavaScript
date: 2020-12-25 17:38:48
tag:
  - js
  - vue
category:
  - front-end development
---

## Preface

Recently, I have been following the blog of Mr. Ruanyifeng, and he is truly an exemplary figure. Writing a blog is not difficult, but what is difficult is to consistently write blogs and maintain a spirit of learning and sharing. Persistence is a challenging thing, and I hope I can keep it up. Now, let's get back to the point. I read a blog post by Mr. Ruanyifeng, which was said to have been criticized ([JavaScript Event Loop Explained: Revisiting Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html "JavaScript Event Loop Explained: Revisiting Event Loop")), and I made a summary based on it.

## Event Loop

> The main thread reads events from the "task queue", and this process is continuous, so this running mechanism is also called the Event Loop.

Let's start with a simple example to illustrate this mechanism in JavaScript: [A Simple Interview Question](https://zhuanlan.zhihu.com/p/25407758 "A Simple Interview Question")

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

This code can be directly run in a browser, and the order of the printed numbers is 2, 3, 5, 4, 1. JavaScript is single-threaded, and the execution process goes from top to bottom.

1. The setTimeout function is put into the "task queue".
2. The function inside the promise is executed directly, printing 2. The resolve() does not affect the subsequent code execution, so it prints 3. The function inside the then will be put at the end of the current execution.
3. Print 5.
4. Before moving on to the next loop of the current function, execute the function inside the then and print 4.
5. The setTimeout function is ready, and it prints 1.

There are a few things to note about the setTimeout function:

- The minimum execution time varies depending on the browser. If you want to show the order of execution, it is best to set it to 16ms or more.
- The set time may not be accurate, as there may be delays in the current code.

> It should be noted that setTimeout() only inserts the event into the "task queue" and the main thread will execute the specified callback function only after the current code (execution stack) is executed. If the current code takes a long time, it may have to wait for a long time, so there is no guarantee that the callback function will be executed at the specified time.

## $nextTick in Vue

Official documentation: [Asynchronous Update Queue](https://vuejs.org/v2/guide/reactivity.html#Asynchronous-Update-Queue)

> Vue internally attempts to use native Promise.then, MutationObserver, and setImmediate for the asynchronous queue. If the execution environment does not support them, it will use setTimeout(fn, 0) instead.

If $nextTick uses the native Promise.then, then it should be at the same level as Promise.then, and the execution order depends on the order of the code. In fact, this is true.
There is also a process.nextTick method in node.js, but I won't go into it for now because I'm not familiar with it.

## wx.nextTick in WeChat Mini Program

Official documentation: [wx.nextTick](https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html)

I haven't encountered this method in WeChat Mini Program yet, but it exists in the source code of vant-weapp. The official documentation's explanation is somewhat vague, but it can be roughly determined that it will be executed in the next time period (tick).

## Conclusion

Understanding these may not necessarily improve your coding skills in a meaningful way, as they rarely appear in everyday code. However, knowing these things is always beneficial, as there will always be bugs and pitfalls waiting for you to discover. And when that time comes, you might just have the right rope at hand.

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
