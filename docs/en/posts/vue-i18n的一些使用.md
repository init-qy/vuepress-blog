---
title: vue-i18n的一些使用
date: 2021-06-10 21:59:15
tag: ['vue']
category: ['前端开发']
---
开始
------

在使用vue编写大型项目时，经常使用的一种国际化方案为Vue i18n。

其中大部分的使用看[官网](
 https://kazupon.github.io/vue-i18n/zh/started.html#javascript "vue-i18n" )就够了,这里仅记录一些在实际使用中的问题。



问题
-------
* t()和tc()
这两个方法在大部分情况下展现一致，以至于经常有人混用。事实上，在大部分情况下都应该使用t()，tc()方法适用于复数，它会让 ‘|’ 无法展示。源码中tc()有这么一段：
```js
const choices = message.split('|') // line:1807
```
因此，如果你的message中含有 ‘|’， 请不要使用tc()。

* 复用性
在一些form表单中,实现i18n可能会显得非常繁复,很多i18n的字段只有一个地方会用到,比如一个简单的form表单:
```vue
<el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
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
在这个form表单中,'年龄'需要i18n,'请输入年龄'也需要,这样i18n就占了两行
```json
{
  "age": "年龄",
  "agePlaceholder": "请输入年龄"
}
```
每个字段的i18n就是两倍的工作量,如果i18n还分了模块,代码就变得冗余:`$('modelA.modelB.age')`和`$('modelA.modelB.agePlaceholder')`
对于这种情况,完全可以写一个方法来代替,如
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
