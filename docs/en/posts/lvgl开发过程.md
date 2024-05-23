---
title: LVGL development process
date: 2024-05-23 11:16:32
tag:
  - lvgl
category:
  - front-end development
---

## Background

I just took on a new project, doing `c++` page development. Since I hadn't been involved in this kind of development before, I'm writing down the process here and also commemorating the approximately 20 days of development. About 50% of the time was spent getting familiar with `lvgl` development, its rendering process, syntax, APIs, and so on. Around 30% of the time was used for compilation and testing, and only the remaining time was actually used for writing code. During this process, the newly added logic led to a continuous growth of corresponding code branches, which required me to spend more time understanding the code later. In the end, I managed to complete the task, but I'm not entirely satisfied with the overall robustness, cleanliness, and readability of the code.

## Style

Due to time constraints, I didn't install a suitable code style management plugin, and the original project also had inconsistent styles, such as mixing tabs and spaces, and inconsistent method alignment. Therefore, I could only maintain a consistent style for the pages I added. Maintaining a consistent project style is actually a high return on investment, as it not only facilitates code reading, but also makes it easier for successors to learn. A healthy project especially needs to pay attention to this point.

## Common Code

Building common code is very important. I've come to realize that "c++" loves reinventing the wheel, but it's not necessary to write a set of wheels for each page in a project. The same goes for modifying gui styles, such as the `disable` and `active` states of buttons that almost every page will have. I think it's entirely possible to abstract these out, rather than having to reset text colors, background colors, and so on each time. For example:

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

This is very simple, yet very necessary, just like how "element-ui" greatly reduces the mental burden of frontend development, a relatively complete ui component can achieve the same effect. It's a pity that "lvgl" doesn't have this, and this project doesn't either.

It seems that "c++" doesn't have package management, nor does it have a tool similar to "npm," which makes the process of referencing libraries relatively complex and lacks that kind of open-source community. At the same time, the high cost of version updates and the fact that a project is only targeted at the current state of a piece of hardware seems to lack the motivation to consider migration and adaptation. Making modifications to a new project based on an old one seems to be a common problem.

## Data Integration

Integration with interfaces is one of the most troublesome issues. Since I only found the cJSON library, I will only talk about the data integration issues related to cJSON.

1. Nesting: For a data structure with many layers of nesting, it requires more effort to obtain the corresponding values. When there are multiple nested arrays, for loops can become a disaster.
2. Modification: When you need to make changes to the data for a certain requirement, you need to pay attention to the difference in references to ensure that the original data is not destroyed.
3. Variables: Storing variables in an appropriate way requires extra attention to the differences between `char[], char*, string`, and proficiency in their assignment, conversion, and other operations.
4. Passing values: When your cJSON*object needs to be passed as a variable, you can first convert it to char*, which may be helpful when unknown errors occur.

## Efficiency

`c++` is fast, and so is `lvgl`. I always thought that creating a `map` to map the index of a `button` in a `vector` would improve the runtime efficiency, but when I tried to get the index through a `for` loop, I didn't find the runtime efficiency decrease, perhaps it's due to the amount of data. In any case, use `for` loops more, although they may not look good, they are at least easy to implement.

Implementing multi-level nested multi-select using `lvgl` is painful, but this is already the most complex functionality in this project. Designing a good data structure to implement this can achieve twice the result with half the effort, as for gui, it doesn't need to be overthought, even if it uses a `for` loop, it can meet basic requirements.

Many design concepts of `lvgl` are inspired by `css`, but you need to confirm its version before you start working on it. Also, this is not html, its position does not change with the content, so when you need to change the position, remember to modify the position of the child objects as well.

## Conclusion

`lvgl` is actually very easy to get started with, even for someone like me who isn't very familiar with `c++`, it can be used to implement functionality. Correspondingly, for performance reasons, `lvgl` does not provide a very complete set of functional components, and the implementation of these functions should be further encapsulated by the project architecture. Otherwise, mixing functionality and business on the page will lead to a heavier mental burden.

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
