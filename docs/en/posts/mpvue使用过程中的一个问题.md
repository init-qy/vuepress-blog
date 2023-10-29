---
title: One issue encountered during the usage of mpvue
date: 2020-11-27 20:48:08
tag:
  - mini-app
  - mpvue
category:
  - front-end development
---

## Preface

Although it's almost 2020, using mpvue may seem outdated. However, mpvue is still the framework that I believe is closest to the Vue syntax for developing frontend of mini programs. From my experience, even though it hasn't been updated for two years, there are no major issues when using mpvue to develop the frontend of mini programs, as long as the main framework of mini programs doesn't undergo significant changes.

From the perspective of frontend development for mobile devices, the emergence of mini programs is revolutionary. The most important aspect is that mini programs not only provide a relatively simple development environment, reducing development costs, but also provide access to user information from popular apps like WeChat. This is particularly important: building an app is too heavy and accumulating a user base takes too long, which limits the ability of small-scale businesses to build a membership system. Mini programs solve this problem and create benefits for both parties, as merchants gain access to user traffic and WeChat can expand its influence.

## Issue

Due to the lifecycle of mpvue, it is not exactly the same as the lifecycle of mini programs. When switching between pages, it is easy to notice a problem: the content filled in the form on the previous page is still there, and the pop-up window from the previous page has not been hidden due to the destruction of the page... After checking the log, it turns out that the values have not been reset. So I updated the values in the onLoad method. It's fine for one page, but what about a bunch of pages?
It's too cumbersome to assign values one by one, but fortunately, this problem can be solved with just one line of code:
`Object.assign(this.$data, this.$options.data())`
Adding this line of code in the onLoad or onUnload method will restore the data to its initial values.

## In-depth

This problem arises because mpvue shares the same instance for the same page and does not destroy it when the mini program is unloaded. The specific problem is explained clearly in [github/mpvue/issue_140](https://github.com/Meituan-Dianping/mpvue/issues/140), and there are also many solutions.

### Object.assign() for object copying

**Basic usage**
The Object.assign method is used to merge objects, copying all enumerable properties from the source object to the target object.
For the first level, this method performs a deep copy, while for deeper levels, it performs a shallow copy.

`Object.assign()` reminds me of the spread operator (...) in ES6, and their implementations are almost the same. As expected:

> The object spread spec explicitly states that `{...obj}` is equivalent to `Object.assign({}, obj)`.

However, there is a slight difference between the two. If I change `Object.assign(this.$data, this.$options.data())` to `this.$data = {...this.$options.data()}`, it will throw an error:

> TypeError: Cannot set property "prop" of #Object which has only a getter (Chrome)

For more details, please refer to [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only)

This can be understood as Java entities not having setters, making the properties read-only.

~~Let me complain about the error message for a moment. Why is it called "only a getter" instead of "no setter"? Isn't the latter clearer?~~

The key difference is that the `Object.assign()` function directly modifies the first passed object `obj`, while the spread operator (...) is more like an assignment operation, which triggers the setter.

## Conclusion

For the sake of code simplicity and readability, the spread operator (...) is preferred. However, there may be cases where it cannot be used, so don't forget that there is an `Object.assign()` function that can be used as an alternative.

~~Wow, that line with the error caused issues with the markdown parsing. What's even more interesting is that I can't even print it out here...~~

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
