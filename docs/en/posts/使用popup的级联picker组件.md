---
title: Using a cascading picker component with a popup.
date: 2020-11-11 09:57:01
tag:
  - mini-app
  - DingTalk
category:
  - front-end development
---

## Background

Since DingTalk does not have a ready-made picker selection component similar to [vant-weapp](https://youzan.github.io/vant-weapp/#/picker "vant-weapp"), I plan to encapsulate one myself. The dependencies used are the popup and button components of `mini-ali-ui`. The native `picker-view` is used.

```json
{
  "component": true,
  "usingComponents": {
    "popup": "mini-ali-ui-rpx/es/popup/index",
    "button": "mini-ali-ui-rpx/es/button/index"
  }
}
```

## Approach

Since this is a component I use myself, considering that most use cases involve multiple columns and may require linkage, I referred to the approach of picker linkage in vant-weapp. I exposed the onChange event for the page to implement the linkage switching effect and dynamically assign values to the lists.
Here, I implemented a setColumnValues method to assign values to the lists, but in fact, it is only necessary to reassign values to the props, which is more convenient.

- This component can also be used for single-column selection. Alipay also has multi-column selection, but DingTalk does not.
- The position can be set to `bottom` or `top`, and left and right positions are not currently considered.
- Custom styles are not considered. As a form selection component, unified styles are better.
- `onChange` is the core of implementing multi-column linkage.
- In `onConfirm`, `detail.value` is the array of selected option indexes, and `detail.detail` is the array of selected option values.

## Implementation

::: tabs#code
@tab axml

```html
<popup
  show="{{show}}"
  animation="{{animation}}"
  position="{{position}}"
  onClose="onCancel"
  zIndex="{{zIndex}}"
>
  <view class="box">
    <slot name="toolbar" a:if="{{position === 'bottom'}}"
      ><view class="toolbar">
        <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
        <text a:if="{{title}}" class="title">{{title}}</text>
        <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
      </view></slot
    >
    <picker-view value="{{value}}" onChange="onChange" class="my-picker">
      <picker-view-column a:for="{{columns}}">
        <view a:for="{{item.values}}" a:for-index="_index" a:for-item="_item"
          >{{_item}}</view
        >
      </picker-view-column>
    </picker-view>
    <slot name="toolbar" a:if="{{position === 'top'}}"
      ><view class="toolbar">
        <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
        <text a:if="{{title}}" class="title">{{title}}</text>
        <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
      </view></slot
    >
  </view>
</popup>
```

@tab acss

```css
.box {
  background: #fff;
  height: 500rpx;
}
.toolbar {
  padding: 0 24rpx;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.am-button {
  font-size: 28rpx;
}
.title {
  font-weight: 600;
}
```

@tab js

```js
import fmtEvent from "mini-ali-ui/es/_util/fmtEvent";
const noop = function noop() {};
Component({
  mixins: [],
  data: {
    value: [],
  },
  props: {
    show: false,
    animation: true,
    position: "bottom",
    zIndex: 100,
    title: "",
    columns: [],
    cancelButtonText: "取消",
    confirmButtonText: "确认",
    onCancel: noop,
    onChange: noop,
    onConfirm: noop,
  },
  didMount() {
    const t = [];
    t.length = this.props.columns.length;
    t.fill(0);
    this.setData({ value: t });
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    onChange(e) {
      const value = e.detail.value;
      let index = -1;
      value.forEach((e, idx) => {
        if (e !== this.data.value[idx]) index = idx;
      });
      this.setData({ value });
      e.detail.picker = this;
      e.detail.index = index;
      const event = fmtEvent(this.props, e);
      this.props.onChange(event);
    },
    onCancel(e) {
      const event = fmtEvent(this.props, e);
      this.props.onCancel(event);
    },
    onConfirm(e) {
      const value = this.data.value;
      const detail = [];
      e.detail.value = value;
      value.forEach((e, idx) => {
        detail.push(this.props.columns[idx].values[Number(e)]);
      });
      e.detail.detail = detail;
      const event = fmtEvent(this.props, e);
      this.props.onConfirm(event);
    },
    //    setColumnValues(index,values){
    //      this.setData({
    //        [`columns[${index}]`]: values ,
    //        [`value[${index}]`]: 0
    //      })
    //    }
  },
});
```

:::

## Considerations

- More styles can be considered.
- In fact, a maximum of three columns are suitable for this display method, and more columns may not be suitable. Restrictions can be applied.
- The combination of popup and picker can be used to replace the native date selection.

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
