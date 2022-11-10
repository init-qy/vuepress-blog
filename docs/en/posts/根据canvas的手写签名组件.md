---
title: 根据canvas的手写签名组件
date: 2021-01-19 14:39:07
tag: ['小程序','钉钉']
category: ['前端开发']
---

## 背景
由于业务需求，需要在钉钉小程序上实现一个手写签名的组件，参考了网上微信小程序实现手写签名的写法，结合自身实际需求，将其包装成一个popup弹出框的样式，同时参考了钉钉审批的手写签名样式。使用到的依赖有`mini-ali-ui`的popup和button组件。同时还有一个本地的图标。
```json
{
  "component": true,
  "usingComponents": {
    "popup": "mini-ali-ui-rpx/es/popup/index",
    "button": "mini-ali-ui-rpx/es/button/index"
  }
}
```
## 思路
具体实现是根据canvas来实现的，小程序端的canvas具体api大同小异，因此这个组件稍改一下应该在微信侧也能使用。

## 一些问题
1. canvas的宽高必须固定，所以实现是根据实际拿到的宽width，乘以一个固定比值为高。在组件中直接传递即可。
2. 必传参数dpr，参考[如何解决画布模糊问题](https://opensupport.alipay.com/support/helpcenter/144/201602562003?ant_source=zsearch "如何解决画布模糊问题")
3. 或许是我理解错误，save和restore没有实现我想要的效果，所以撤回功能可能需要换一种方式实现。这里去掉了这个功能。
4. clearRect不能清除，需要在之前加上一行`content.beginPath()`，无法理解这个问题如何产生。

###### 附：clearRect不生效对比图
![clearRect不生效](https://i.loli.net/2021/01/19/xokKRpPZgyB1AsV.gif "clearRect不生效")
![clearRect生效](https://i.loli.net/2021/01/19/9a4cnIYhqrBfVDM.gif "clearRect生效")
## 实现
##### axml
```html
<popup show="{{show}}" animation="{{animation}}" position="{{position}}" onClose="onCancel" zIndex="{{zIndex}}">
  <view class="box">
    <slot name="toolbar"><view class="toolbar">
      <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
      <text a:if="{{title}}" class="title">{{title}}</text>
      <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
    </view></slot>
    <canvas width="{{width*dpr}}" height="{{height*dpr}}" style="{{'width:'+(width-4)+'px;height:'+(height-4)+'px;'}}" class="sign" id="sign" onTouchMove="move" onTouchStart="start" onTouchEnd="end" onTouchCancel="cancel" onLongTap="tap" disable-scroll="{{true}}" onTap="tap">
    </canvas>
    <image class="clear-icon" src="/icon/icon_clear.svg" onTap="clearClick"></image>
    <!--适应底部-->
    <view style="height: 24rpx"></view>
  </view>
</popup>
```
##### js
```javascript
import fmtEvent from "mini-ali-ui-rpx/es/_util/fmtEvent";
const noop = function noop() {};
Component({
  mixins: [],
  data: {
    ctx: null,
    points: [],
    signImage: ''
  },
  props: {
    show:false,
    animation:true,
    zIndex:100,
    title:'手写签名',
    cancelButtonText:'取消',
    confirmButtonText:'完成',
    onCancel:noop,
    onConfirm:noop,
    width: 300,
    height: 225,
    dpr: 2
  },
  didMount() {
    //获得Canvas的上下文
    this.data.ctx = dd.createCanvasContext('sign');
    //设置线的颜色
    this.data.ctx.setStrokeStyle("#000");
    //设置线的宽度
    this.data.ctx.setLineWidth(3);
    //设置线两端端点样式更加圆润
    this.data.ctx.setLineCap('round');
    //设置两条线连接处更加圆润
    this.data.ctx.setLineJoin('round');
    this.data.ctx.scale(this.props.dpr,this.props.dpr)
    this.data.ctx.save()
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 画布的触摸移动开始手势响应
    start (e) {
      //获取触摸开始的 x,y
      // this.data.ctx.save()
      console.log(e)
      let point = { x: e.changedTouches[0].x, y: e.changedTouches[0].y }
      this.$spliceData({points: [0, 0 ,point ]})
    },
    // 画布的触摸移动手势响应
    move (e) {
      let point = { x: e.touches[0].x, y: e.touches[0].y }
      this.$spliceData({points: [this.data.points.length, 0 ,point ]})
      if (this.data.points.length >= 2) {
        this.draw();
      }
    },
    // 画布的触摸移动结束手势响应
    end (e) {
      // console.log("触摸结束",e);
      //清空轨迹数组
      this.setData({
        points: []
      })
      this.data.ctx.save()
    },
    // 画布的触摸取消响应
    cancel (e) {
      console.log("触摸取消" + e);
    },
    // 画布的长按手势响应
    tap(e) {
      console.log("长按手势" , e);
    },
    error(e) {
      console.log("画布触摸错误" + e);
    },
    //绘制
    draw() {
      let point1 = this.data.points[0];
      let point2 = this.data.points[1];
      this.$spliceData({points: [0, 1 ]})
      this.data.ctx.moveTo(point1.x, point1.y);
      this.data.ctx.lineTo(point2.x, point2.y);
      this.data.ctx.stroke();
      this.data.ctx.draw();
    },
    //清除操作
    clearClick() {
      //清除画布
      // console.log(this.data.points)
      this.data.ctx.save();
      //非常重要,没有就会有问题
      this.data.ctx.beginPath()
      this.data.ctx.clearRect(0, 0,this.props.width, this.props.height);

      this.data.ctx.draw();
    },
    //保存图片
    saveClick() {
      const that = this;
      this.data.ctx.toTempFilePath({
        success(res) {
          console.log(res)
          that.setData({
            signImage: res.filePath
          })
        },
      });
    },
    onCancel(e){
      const event = fmtEvent(this.props, e);
      this.props.onCancel(event);
    },
    onConfirm(e){
      this.saveClick()
      e.detail.value = this.data.signImage
      const event = fmtEvent(this.props, e);
      this.props.onConfirm(event);
    },
  },
});

```

##### acss
```css
.sign{
    box-sizing: border-box;
    border: 2px #BBBBBB dashed;
}
.box{
    background: #fff;
    position: relative;
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
.clear-icon{
    position: absolute;
    right: 40rpx;
    bottom: 80rpx;
    width: 66rpx;
    height: 66rpx;
}

```

