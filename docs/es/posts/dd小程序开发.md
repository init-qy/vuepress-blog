---
title: Problemas en el desarrollo de DingTalk (actualización continua)
date: 2020-11-02 17:58:00
tag:
  - mini-app
  - DingTalk
category:
  - desarrollo front-end
---

## 2020-10

1. En DingTalk, no se admite el uso de la etiqueta `&nbsp;` para agregar espacios en blanco en el texto. En su lugar, utiliza espacios en blanco de ancho completo en chino `{{' '}}`.
2. El método `dd.switchTab` en DingTalk tiene problemas, no muestra errores ni advertencias. La solución actual es utilizar `dd.reLaunch`.
3. En DingTalk (y Alipay, no probado), el componente `<swiper>` solo puede contener componentes `<swiper-item>`. Si envuelves los componentes `<swiper-item>` con `view`, es posible que no se muestren correctamente.

### Ejemplo de uso del componente swiper

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

### Componente de opciones m-picker

- Utiliza `setColumnValues` para lograr efectos de interacción múltiple. Consulta `brand-add.js` para más detalles.
- En `onConfirm`, `detail.value` es un array de índices de opciones y `detail.detail` es un array de valores de opciones.

## 2020-11

1. **Muy importante:** No llames a funciones para asignar valores durante la inicialización de `data`, de lo contrario, la página no podrá encontrarlos.

> Ejemplo incorrecto

```js
data: {
  a: getProjectName();
}
```

> Ejemplo correcto

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

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
