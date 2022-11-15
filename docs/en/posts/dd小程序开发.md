---
title: 钉钉开发中一些问题(持续更新)
date: 2020-11-02 17:58:00
tag: ["小程序", "钉钉"]
category: ["前端开发"]
---

## 2020-10

1. 钉钉不支持 `&nbsp;` text 标签中的空格用中文全角空格代替`{{' '}}`
2. 钉钉 `dd.switchTab` 方法有问题,既不报错也无提示,现解决方案由 `dd.reLaunch` 代替
3. 钉钉(与支付宝,未测试) `<swiper>`组件下只能接`<swiper-item>`组件,使用`view`包裹`<swiper-item>`组件可能无法正常显示

### swiper 组件使用样例

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

### 选项组件 m-picker

- 使用`setColumnValues`实现多项联动效果,具体参照 `brand-add.js`
- `onConfirm`中 `detail.value` 为选项 index 数组 `detail.detail` 为选项值数组

## 2020-11

1.**非常重要** 不要在 data 初始化的时候调用函数进行赋值,否则页面会找不到

> 反例

```js
data: {
  a: getProjectName();
}
```

> 正例

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
