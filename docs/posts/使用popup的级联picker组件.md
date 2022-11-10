---
title: 使用popup的级联picker组件
date: 2020-11-11 09:57:01
tag: ['小程序','钉钉']
category: ['前端开发']
---

背景
----
由于钉钉没有现成的类似 [vant-weapp](https://youzan.github.io/vant-weapp/#/picker "vant-weapp") 这样的picker选择组件，于是打算自己封装一个。使用到的依赖有`mini-ali-ui`的popup和button组件。使用了原生的`picker-view`
```json
{
  "component": true,
  "usingComponents": {
    "popup": "mini-ali-ui-rpx/es/popup/index",
    "button": "mini-ali-ui-rpx/es/button/index"
  }
}
```
思路
----
由于是自己使用的一个组件，考虑到使用情况大多数为多列，可能需要联动的情况，参考了vant-weapp中picker联动的做法，将onChange事件暴露出去，由页面自行实现联动切换效果，将列表进行动态赋值。
这里我实现了一个setColumnValues方法，作用是对列表赋值；但实际上只需重新为props赋值就行，这样更加方便。
- 单列选择也可以使用此组件，支付宝也有多列选择，但是钉钉没有
- position为`bottom`或`top`，左右暂不考虑实现
- 没有考虑自定义样式，作为一个form表单的选择组件，样式统一比较好
- `onChange`是实现多列联动的核心
- `onConfirm`中 `detail.value` 为选项index数组， `detail.detail` 为选项值数组

实现
----
###### axml
```html
<popup show="{{show}}" animation="{{animation}}" position="{{position}}" onClose="onCancel" zIndex="{{zIndex}}">
  <view class="box">
    <slot name="toolbar" a:if="{{position === 'bottom'}}"><view class="toolbar">
      <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
      <text a:if="{{title}}" class="title">{{title}}</text>
      <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
    </view></slot>
    <picker-view value="{{value}}" onChange="onChange" class="my-picker">
      <picker-view-column a:for="{{columns}}">
        <view a:for="{{item.values}}" a:for-index="_index" a:for-item="_item">{{_item}}</view>
      </picker-view-column>
    </picker-view>
    <slot name="toolbar" a:if="{{position === 'top'}}"><view class="toolbar">
      <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
      <text a:if="{{title}}" class="title">{{title}}</text>
      <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
    </view></slot>
  </view>
</popup>
```
###### acss
```css
.box{
    background: #fff;
    height:500rpx;
}
.toolbar{
    padding: 0 24rpx;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.am-button{
    font-size: 28rpx;
}
.title{
    font-weight: 600;
}

```
###### js
```js
import fmtEvent from "mini-ali-ui/es/_util/fmtEvent";
const noop = function noop() {};
Component({
  mixins: [],
  data: {
    value:[]
  },
  props: {
    show:false,
    animation:true,
    position:'bottom',
    zIndex:100,
    title:'',
    columns:[],
    cancelButtonText:'取消',
    confirmButtonText:'确认',
    onCancel:noop,
    onChange:noop,
    onConfirm:noop,
  },
  didMount() {
    let t = []
    t.length = this.props.columns.length
    t.fill(0)
    this.setData({value: t})
  },
  didUpdate() {},
  didUnmount() {
  },
  methods: {
    onChange(e) {
      const value = e.detail.value
      let index = -1
      value.forEach((e,idx)=> {
        if(e!==this.data.value[idx]) index = idx
      })
      this.setData({value:value})
      e.detail.picker = this
      e.detail.index = index
      const event = fmtEvent(this.props, e);
      this.props.onChange(event);
    },
    onCancel(e){
      const event = fmtEvent(this.props, e);
      this.props.onCancel(event);
    },
    onConfirm(e){
      const value = this.data.value
      let detail = []
      e.detail.value = value
      value.forEach((e,idx)=> {
        detail.push(this.props.columns[idx].values[Number(e)])
      })
      e.detail.detail = detail
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
思考
----
- 可以考虑更多样式
- 其实最多三列，更多不适合这样展示，可以做限制
- 使用popup和picker的组合，可以考虑替换原生的日期选择
