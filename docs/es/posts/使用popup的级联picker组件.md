---
title: Componente de selector en cascada con popup
date: 2020-11-11 09:57:01
tag:
  - mini-app
  - DingTalk
category:
  - desarrollo front-end
---

## Background

Como DingTalk no tiene un componente de selección de picker similar a [vant-weapp](https://youzan.github.io/vant-weapp/#/picker "vant-weapp"), decidí crear uno propio. Utiliza los componentes de popup y button de `mini-ali-ui`. También utiliza el `picker-view` nativo.

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

Dado que este es un componente que estoy utilizando personalmente y considerando que la mayoría de los casos de uso implican selecciones de múltiples columnas y posiblemente interdependientes, me he basado en la implementación de la selección de múltiples columnas en vant-weapp. Expongo el evento `onChange` para que la página pueda implementar la lógica de interdependencia y actualizar dinámicamente las listas. He implementado un método llamado `setColumnValues` que se utiliza para asignar los valores a las listas, pero en realidad solo es necesario asignar nuevos valores a las propiedades (`props`), lo cual es más conveniente.

- Este componente también se puede utilizar para selecciones de una sola columna. Alipay también tiene selecciones de múltiples columnas, pero DingTalk no.
- La posición puede ser `bottom` o `top`, pero no se ha implementado la alineación izquierda o derecha.
- No se ha considerado la personalización del estilo. Como este componente es parte de un formulario, es mejor mantener un estilo uniforme.
- El evento `onChange` es fundamental para implementar la interdependencia de múltiples columnas.
- En el evento `onConfirm`, `detail.value` es un array con los índices de las opciones seleccionadas y `detail.detail` es un array con los valores de las opciones seleccionadas.

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

- Se pueden considerar más estilos.
- En realidad, como máximo se pueden utilizar tres columnas. No es adecuado mostrar más columnas de esta manera, por lo que se puede establecer un límite.
- La combinación de los componentes de popup y picker se puede utilizar para reemplazar la selección de fechas nativa.

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
