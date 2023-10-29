---
title: Algunos usos de vue-i18n
date: 2021-06-10 21:59:15
tag:
  - vue
category:
  - desarrollo front-end
---

## Comenzar

Cuando se trabaja en proyectos grandes con Vue, a menudo se utiliza Vue i18n como solución de internacionalización.

La mayoría de los casos de uso se pueden encontrar en la [documentación oficial](https://kazupon.github.io/vue-i18n/zh/started.html#javascript "vue-i18n"), aquí solo se registrarán algunos problemas que se pueden encontrar en el uso práctico.

## Problemas

- t() y tc()
  Estos dos métodos son muy similares en la mayoría de los casos, lo que lleva a que a menudo se confundan. De hecho, en la mayoría de los casos se debe utilizar t(). El método tc() se utiliza para casos de pluralidad, lo cual impide que se muestre el carácter '|'. En el código fuente, tc() tiene la siguiente sección:

```js
const choices = message.split("|"); // line:1807
```

Por lo tanto, si tu mensaje contiene '|', por favor no utilices tc().

- Reutilización
  En algunos formularios, implementar la internacionalización puede resultar complicado. Muchos campos de internacionalización solo se utilizan en un lugar, como en un formulario simple:

```vue
<el-form
  :model="numberValidateForm"
  ref="numberValidateForm"
  label-width="100px"
  class="demo-ruleForm"
>
  <el-form-item
    label="年龄"
    prop="age"
    :rules="[
      { required: true, message: '请输入年龄'}
    ]"
  >
    <el-input type="age" v-model.number="numberValidateForm.age" autocomplete="off" placeholder="请输入年龄"></el-input>
  </el-form-item>
</el-form>
```

En este formulario, 'Edad' necesita internacionalización, al igual que 'Por favor ingrese su edad'. Esto significa que la internacionalización ocupa dos líneas:

```json
{
  "age": "年龄",
  "agePlaceholder": "请输入年龄"
}
```

La internacionalización de cada campo implica el doble de trabajo. Si además se divide la internacionalización en módulos, el código se vuelve redundante: `$('modelA.modelB.age')` y `$('modelA.modelB.agePlaceholder')`. Para este tipo de situaciones, se puede escribir un método que los reemplace, como se muestra a continuación:

```js
    placeholder(key, inputType = 0, lengthOption = { min: 1, max: 128 }) {
      // 1 input 2 pick 3 length
      const name = this.$t(`modelA.modelB.${key}`);
      if (inputType === 0) {
        return name;
      } else if (inputType === 1) {
        return this.$t('modelA.modelB.nullPrompt') + name;
      } else if (inputType === 2) {
        return this.$t('modelA.modelB.nullPick') + name;
      } else if (inputType === 3) {
        return name + this.$t('modelA.modelB.nameLength', lengthOption);
      }
    },
```

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
