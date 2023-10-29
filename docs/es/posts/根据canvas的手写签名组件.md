---
title: Según el componente de firma manual de Canvas,
date: 2021-01-19 14:39:07
tag:
  - mini-app
  - DingTalk
category:
  - desarrollo front-end
---

## Background

Due to business requirements, it is necessary to implement a handwriting signature component on the DingTalk mini program. After referring to the method of implementing a handwriting signature in WeChat mini programs online and considering our own actual needs, we have packaged it into a popup dialog style, while also referring to the handwriting signature style in DingTalk approval. The dependencies used include the `mini-ali-ui` popup and button components, as well as a local icon.

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

The specific implementation is based on the canvas. The canvas API on the mini program side is similar to that of WeChat, so with a slight modification, this component should also be usable on the WeChat side.

## Some Issues

1. The width and height of the canvas must be fixed, so the implementation is based on the actual width obtained multiplied by a fixed ratio for the height. This can be passed directly in the component.
2. The required parameter `dpr` needs to be referenced. For more information, please refer to [How to Solve the Blurry Canvas Problem](https://opensupport.alipay.com/support/helpcenter/144/201602562003?ant_source=zsearch).
3. Perhaps I misunderstood, but the `save` and `restore` functions did not achieve the desired effect, so the undo feature may need to be implemented in a different way. It has been removed here.
4. `clearRect` does not work properly, so it needs to be preceded by `content.beginPath()`. I cannot understand how this issue arises.

:::: note Attached: Comparison of clearRect Not Working

::: tabs#imgs

@tab clearRect Not Working

![clearRect Not Working](/assets/img/clearRect_not.gif "clearRect Not Working")

@tab clearRect Working

![clearRect Working](/assets/img/clearRect_yes.gif "clearRect Working")

:::

::::

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
    <slot name="toolbar"
      ><view class="toolbar">
        <button type="text" onTap="onCancel">{{cancelButtonText}}</button>
        <text a:if="{{title}}" class="title">{{title}}</text>
        <button type="text" onTap="onConfirm">{{confirmButtonText}}</button>
      </view></slot
    >
    <canvas
      width="{{width*dpr}}"
      height="{{height*dpr}}"
      style="{{'width:'+(width-4)+'px;height:'+(height-4)+'px;'}}"
      class="sign"
      id="sign"
      onTouchMove="move"
      onTouchStart="start"
      onTouchEnd="end"
      onTouchCancel="cancel"
      onLongTap="tap"
      disable-scroll="{{true}}"
      onTap="tap"
    >
    </canvas>
    <image
      class="clear-icon"
      src="/icon/icon_clear.svg"
      onTap="clearClick"
    ></image>
    <!--适应底部-->
    <view style="height: 24rpx"></view>
  </view>
</popup>
```

@tab js

```javascript
import fmtEvent from "mini-ali-ui-rpx/es/_util/fmtEvent";
const noop = function noop() {};
Component({
  mixins: [],
  data: {
    ctx: null,
    points: [],
    signImage: "",
  },
  props: {
    show: false,
    animation: true,
    zIndex: 100,
    title: "手写签名",
    cancelButtonText: "取消",
    confirmButtonText: "完成",
    onCancel: noop,
    onConfirm: noop,
    width: 300,
    height: 225,
    dpr: 2,
  },
  didMount() {
    //获得Canvas的上下文
    this.data.ctx = dd.createCanvasContext("sign");
    //设置线的颜色
    this.data.ctx.setStrokeStyle("#000");
    //设置线的宽度
    this.data.ctx.setLineWidth(3);
    //设置线两端端点样式更加圆润
    this.data.ctx.setLineCap("round");
    //设置两条线连接处更加圆润
    this.data.ctx.setLineJoin("round");
    this.data.ctx.scale(this.props.dpr, this.props.dpr);
    this.data.ctx.save();
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 画布的触摸移动开始手势响应
    start(e) {
      //获取触摸开始的 x,y
      // this.data.ctx.save()
      console.log(e);
      let point = { x: e.changedTouches[0].x, y: e.changedTouches[0].y };
      this.$spliceData({ points: [0, 0, point] });
    },
    // 画布的触摸移动手势响应
    move(e) {
      let point = { x: e.touches[0].x, y: e.touches[0].y };
      this.$spliceData({ points: [this.data.points.length, 0, point] });
      if (this.data.points.length >= 2) {
        this.draw();
      }
    },
    // 画布的触摸移动结束手势响应
    end(e) {
      // console.log("触摸结束",e);
      //清空轨迹数组
      this.setData({
        points: [],
      });
      this.data.ctx.save();
    },
    // 画布的触摸取消响应
    cancel(e) {
      console.log("触摸取消" + e);
    },
    // 画布的长按手势响应
    tap(e) {
      console.log("长按手势", e);
    },
    error(e) {
      console.log("画布触摸错误" + e);
    },
    //绘制
    draw() {
      let point1 = this.data.points[0];
      let point2 = this.data.points[1];
      this.$spliceData({ points: [0, 1] });
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
      this.data.ctx.beginPath();
      this.data.ctx.clearRect(0, 0, this.props.width, this.props.height);

      this.data.ctx.draw();
    },
    //保存图片
    saveClick() {
      const that = this;
      this.data.ctx.toTempFilePath({
        success(res) {
          console.log(res);
          that.setData({
            signImage: res.filePath,
          });
        },
      });
    },
    onCancel(e) {
      const event = fmtEvent(this.props, e);
      this.props.onCancel(event);
    },
    onConfirm(e) {
      this.saveClick();
      e.detail.value = this.data.signImage;
      const event = fmtEvent(this.props, e);
      this.props.onConfirm(event);
    },
  },
});
```

@tab acss

```css
.sign {
  box-sizing: border-box;
  border: 2px #bbbbbb dashed;
}
.box {
  background: #fff;
  position: relative;
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
.clear-icon {
  position: absolute;
  right: 40rpx;
  bottom: 80rpx;
  width: 66rpx;
  height: 66rpx;
}
```

:::

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
