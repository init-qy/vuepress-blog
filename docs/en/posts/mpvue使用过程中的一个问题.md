---
title: mpvue使用过程中的一个问题
date: 2020-11-27 20:48:08
tag: ['小程序','mpvue']
category: ['前端开发']
---
前言
------
虽然说都快1202年了，还在使用mpvue可能已经跟不上时代。但是mpvue仍然是我认为写小程序前端最靠近vue写法的框架，而且从使用情况来看，即使已经两年没有更新，使用mpvue框架编写小程序前端依然没有什么致命的问题，我觉得只要小程序的主要框架不发生大的改变，mpvue的使用就没有太大的问题。
从移动端前端的发展来看，小程序的出现是革命性的。最主要的是小程序不仅提供了较为简单的开发环境，**降低了开发成本**；同时提供了国民级软件（如微信）的**用户信息**。这点尤为重要：app的构建太过沉重，用户量的累积也过于漫长，这点限制了规模较小商户的会员体系构建，而小程序解决了这个问题，并同时为双方创造收益，商户获得了用户流量入口，微信也可以借此扩大自身的影响。

问题
------
由于mpvue的生命周期，它并不完全等同与小程序的生命周期，在页面切换的时候很容易发现一个问题：之前页面表单填写的内容还在，之前页面的弹窗还没有因为页面销毁而隐藏。。。然后打log一看，原来是值没有重置，于是就在onLoad里更新了一下值。一个还好，一堆呢？
一个一个赋值太麻烦了，好在这个问题一行代码就能搞定
`Object.assign(this.$data, this.$options.data())`
在onLoad或在onUnload方法加上这行代码就能让data恢复初始值

深入
-------
这个问题的出现源于mpvue在相同页面时共用一个实例，并且在小程序onUnload时并未销毁。具体问题在[github/mpvue/issue_140](https://github.com/Meituan-Dianping/mpvue/issues/140 "github/mpvue/issue_140")中解释的很清楚，解决方案也有很多。
###### Object.assign()对象的拷贝
**基本用法**
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）
同时对于第一级，这个方法是深拷贝，而对于更深的层次则是浅拷贝

`Object.assign()`这个方法让我想起的es6中的扩展运算符（...），这两者的实现近乎相同，果然：
> object spread spec 明确指出`{… obj}`等同于`Object.assign（{}，obj）`。

这两者还是有一点区别的，如果我将`Object.assign(this.$data, this.$options.data())`改为`this.$data = {...this.$options.data()}`，会报错

>TypeError: Cannot set property "prop" of #Object which has only a getter (Chrome)

具体参考
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only)

可以理解为Java实体没有setter，属性只读。

~~吐槽一下报错信息，为什么要叫只有一个getter，而不叫没有setter，这样不是更清楚吗~~

其中关键的区别是：`Object.assign()`函数是直接修改其第一个传入对象obj，而扩展运算符（...）的使用更像是一个赋值操作，因此会触发setter。

最后
------
为了代码的简洁和易读性，使用扩展运算符（...）更好，但是也有无法使用的情况，这时不要忘记还有一个`Object.assign()`函数可以代替。

~~好家伙，报错那行有导致md解析出问题的字符,更骚的是我不能在这行打出来...~~
