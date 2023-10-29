---
title: Some usage of vue-i18n
date: 2021-06-10 21:59:15
tag:
  - vue
category:
  - front-end development
---

## Getting Started

When developing large projects using Vue, one commonly used internationalization solution is Vue i18n.

For most use cases, referring to the [official documentation](https://kazupon.github.io/vue-i18n/zh/started.html#javascript) is sufficient. Here, we will only address some issues that may arise during practical usage.

## Issues

- t() and tc()
  These two methods are often used interchangeably because they appear to be similar in most cases. However, in most situations, t() should be used, while tc() is specifically designed for handling pluralization, which may cause issues with the '|' character. In the source code, there is a section for tc():

```js
const choices = message.split("|"); // line:1807
```

Therefore, if your message contains '|', please avoid using tc().

- Reusability
  Implementing i18n in some form fields can be cumbersome. Many i18n fields are only used in one place, such as in a simple form:

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

In this form, 'Age' requires i18n, and 'Please enter your age' also needs to be translated. This means that i18n takes up two lines:

```json
{
  "age": "年龄",
  "agePlaceholder": "请输入年龄"
}
```

Each field's i18n doubles the workload. If i18n is also divided into modules, the code becomes redundant, such as `$('modelA.modelB.age')` and `$('modelA.modelB.agePlaceholder')`. For such cases, it is completely feasible to write a method as a replacement, like this:

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

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
