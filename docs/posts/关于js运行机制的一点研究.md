---
title: 关于js运行机制的一点研究
date: 2020-12-25 17:38:48
tag: ['js','vue']
category: ['前端开发']
---

# 前言
最近追了阮一峰阮老师的博客，真的是吾辈楷模。写博客不难，难得是一直写博客，一直保持学习、分享的精神。坚持是一件很难的事情，希望我能够坚持下去。言归正传，我是通过阮老师一篇据说被喷的博客（[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html "JavaScript 运行机制详解：再谈Event Loop")）中去理解了一下，自己做了一点总结。
# Event Loop
> 主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

先从一个简单的例子来说明js的这种机制：[一道简单的面试题](https://zhuanlan.zhihu.com/p/25407758 "一道简单的面试题")
```javascript
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);
```
这段代码可以直接在浏览器中运行，其中打印的顺序为2，3，5，4，1
js是单线程的，执行的过程从上到下

1. setTimeout函数放入“任务队列”
2. promise里函数直接执行，打印 2，resolve()不会影响后面代码执行，打印3，then里的函数会放在当前执行的最后
3. 打印5
4. 来到当前函数下个循环之前，执行then里的函数，打印4
5. setTimeout函数已就绪，打印1

关于setTimeout函数有几点需要注意：
- 最小执行时间根据浏览器有所不同，如果需要表现出先后执行顺序，最好设置在16ms以上
- 设置的时间不一定会精确，可能因为当前代码延迟出现不准的情况

> 需要注意的是，setTimeout()只是将事件插入了"任务队列"，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在setTimeout()指定的时间执行。

# vue中的$nextTick
官方文档：[异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97 "异步更新队列")

> Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

如果$nextTick使用原生的 Promise.then，那么它应该与Promise.then平级，执行顺序取决于代码的先后，事实上确实如此。
在node.js中也存在process.nextTick方法，不过因为不熟悉，暂且不表。

# 小程序中的wx.nextTick
官方文档：[wx.nextTick](https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html "wx.nextTick")
小程序中还未接触过这个方法，但是在vant-weapp源码中存在。官方文档的解释比较模糊，但大致可以确定为下一个时间段(tick)执行。
# 最后
了解到这些可能不会真正意义上提高你的代码水平，它很少出现在日常的代码中。不过这些东西，知道就是知道，总会有bug和坑等待你的发现，到时候，说不定身边正好有一根绳子。
