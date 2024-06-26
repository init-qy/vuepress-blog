---
title: lvgl 开发过程
date: 2024-05-23 11:16:32
tag: ["lvgl"]
category: ["前端开发"]
---

## 背景

新接了项目，做`c++`页面的开发，由于之前没有接触过相关的开发，在此记录下过程，同时也纪念下二十天左右的开发时长。大约50%左右的时间用在熟悉`lvgl`开发，它的渲染过程，语法，API等方面，30%左右的时间用来编译，测试，只有剩下的时间是真正用来编写代码的。在这个过程中，新加的逻辑，对应的代码分支在不断增长，也会让后来的我需要更长的时间理解代码，最后磕磕绊绊，算是完成了任务，但我对代码的整体健壮性，整洁度，可读性都不太满意。

## 风格

由于时间紧迫，我并没有安装一个合适的代码风格管理插件，原项目也存在风格不统一的情况，tab和空格混用，方法对齐之类，因此我只能在我新加的页面中保持风格统一。保持项目风格的统一其实是一件投入产出比很高的事情，因为这不仅方便代码阅读，也方便后来者接手学习，一个健康的项目尤其需要注意这点。

## 公共代码

公共代码建设是很重要的一点，`c++`爱造轮子我算是见识到了，但在一个项目中倒是不必每个页面都写一套轮子，对gui样式的修改也是如此，比如几乎每个页面都会有的按钮，设置它的`disable`和`active`状态，我觉得完全可以抽象出来，而不必每次都去重新设置文字颜色，背景颜色等。比如:

```c++
static void setBtnActive(lv_obj_t* btn){
    lv_obj_set_style_local_bg_color         (btn, GUI_BTN_PART_MAIN, GUI_STATE_DEFAULT, LIGHT_BTN_NORMAL);
    lv_obj_set_style_local_bg_color         (btn, GUI_BTN_PART_MAIN, GUI_STATE_PRESSED, LIGHT_BTN_PRESSED);
    lv_obj_set_style_local_text_color       (btn, GUI_BTN_PART_MAIN, GUI_STATE_DEFAULT, GUI_COLOR_BLACK);
    lv_obj_set_style_local_text_color       (btn, GUI_BTN_PART_MAIN, GUI_STATE_PRESSED, GUI_COLOR_BLACK);
}
static void setBtnDefault(lv_obj_t* btn){
    lv_obj_set_style_local_bg_color         (btn, GUI_BTN_PART_MAIN, GUI_STATE_DEFAULT, GUI_DEF_BTN_COLOR);
    lv_obj_set_style_local_bg_color         (btn, GUI_BTN_PART_MAIN, GUI_STATE_PRESSED, GUI_SELECT_BTN_COLOR);
    lv_obj_set_style_local_text_color       (btn, GUI_BTN_PART_MAIN, GUI_STATE_DEFAULT, GUI_COLOR_WHITE);
    lv_obj_set_style_local_text_color       (btn, GUI_BTN_PART_MAIN, GUI_STATE_PRESSED, GUI_COLOR_BLACK);
}
```

这很简单，也很有必要，就像`element-ui`大大减小了前端开发的心智负担，一个相对完整的ui组件也能做到同样的事情，很可惜`lvgl`并没有，这个项目也没有。

`c++`似乎没有包管理，没有类似`npm`的工具，导致其引用库的过程相对复杂，也没有那种开源的社区。同时版本的更新成本高，一个项目只针对一个硬件的现状导致了其似乎没有动力考虑迁移，适配的问题。新项目在老项目上修修改改也能做，这似乎是个普遍的问题。

## 对接数据

和接口对接是最麻烦的问题之一，由于我只找到了cJSON库，所以只谈谈cJSON对接数据的问题。

1. 嵌套: 对于一个有很多层嵌套的数据解构来说，需要耗费更大的精力来获取对应的值，当其中包括多个嵌套数组的话，for循环会成为一个灾难。
2. 修改：当你出于某种需求需要对数据做些修改时，需要注意引用的区别，确保原数据不会被破坏。
3. 变量：把变量以合适的方式存储，需要额外注意 `char[],char*,string` 的区别，熟练掌握它们之间的赋值，转换等操作。
4. 传值：当你的cJSON*对象需要作为变量传递时，可以先把它转成char*，在出现未知错误的时候这一点可能有帮助。

## 快

`c++`很快，`lvgl`也很快。我之前一直觉得创建一个`map`来映射`button`在`vector`中的索引会提高运行效率，但当我尝试过`for`循环获取索引后，并没有发现运行效率变慢，或许是数据量的问题。总之，多用`for`循环，虽然它不是很好看，但至少很容易实现。

用`lvgl`实现多层嵌套的多选很痛苦，但这已经算是这个项目中最复杂的功能了。设计一个好的解构体来实现能事半功倍，至于gui，其实不需要过多考虑，就算是用for循环，也能达到基本要求。

`lvgl`的很多设计理念参考了`css`，但在上手前需要确认它的版本。另外，这不是html，它的位置不会跟随变化，当需要修改位置时，记得把子对象的位置也一起修改。

## 总结

`lvgl`还是很容易上手的，对于我这种`c++`不是很熟悉的人，也能用它来实现功能。相对应的，出于性能的原因，`lvgl`并没有提供很全的功能组件，这些功能的实现应交由项目架构来进行进一步的封装。否则的话，页面混杂着功能和业务，心智负担就较重了。
