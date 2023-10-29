---
title: Some issues in DingTalk development (continuously updated)
date: 2020-11-02 17:58:00
tag:
  - mini-app
  - DingTalk
category:
  - front-end development
---

## 2020-10

1. DingTalk does not support the use of `&nbsp;` in the `text` tag. Please replace the spaces with Chinese full-width spaces `{{' '}}`.
2. The `dd.switchTab` method in DingTalk has some issues. It neither throws an error nor provides any prompts. The current solution is to use `dd.reLaunch` instead.
3. In DingTalk (and Alipay, not tested), the `<swiper>` component can only contain `<swiper-item>` components. Wrapping `<swiper-item>` components with a `view` may cause display issues.

### Example of using the swiper component

```html
<swiper
  :indicator-dots="{{indicatorDots}}"
  :autoplay="{{autoplay}}"
  :interval="{{interval}}"
  :duration="{{duration}}"
  :circular="{{circular}}"
  style="height:auto"
>
  <swiper-item a:for="{{banners}}">
    <view onTap="goToPage" class="banner">
      <image
        src="{{item.picUrl||'http://bing.getlove.cn/bingImage'}}"
        mode="widthFix"
        class="banner-image"
      />
    </view>
  </swiper-item>
</swiper>
```

### Option component m-picker

- Use `setColumnValues` to achieve multiple linkage effects. Please refer to `brand-add.js` for details.
- In the `onConfirm` event, `detail.value` represents the index array of the selected options, and `detail.detail` represents the value array of the selected options.

## 2020-11

1. **Very important:** Do not call functions to assign values during data initialization, otherwise the page will not be able to find them.

> Negative example

```js
data: {
  a: getProjectName();
}
```

> Positive example

```js
data:{
    a:''
}
onLoad() {
    this.setData({
      a:getProjectName()
    })
}
```

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
