---
breadcrumb: false
toc: false
sidebar: false
pageInfo: false
prev: false
next: false
editLink: false
lastUpdated: false
contributors: false
article: false
containerClass: custom-container
---
# 动漫图片超分辨率 Real-CUGAN


本项目基于Web Assembly技术，在浏览器端使用CPU完成图像处理，不会上传任何图片到云端。
注意：本页面处理图片时占用内存约900M，且CPU占用较高。如果使用有问题，请在PC端使用最新版的Chrome或Firefox打开本页面。如输出有问题或长时间无响应，请刷新重试。

超分倍率: 会决定输出图片的尺寸。目前3X处理会耗时比较久，推荐2X。
降噪版: 如果原片噪声多，压得烂，推荐使用； 无降噪版：适合原图噪声不多，想提高分辨率/清晰度/做通用性的增强、修复处理； 保守版: 如果你担心丢失纹理，担心画风被改变，担心颜色被增强，总之就是各种担心AI会留下浓重的处理痕迹，推荐使用该版本
<RealcuganNcnnWebassembly></RealcuganNcnnWebassembly>
<script setup lang="ts">
import RealcuganNcnnWebassembly from "@RealcuganNcnnWebassembly";
</script>
<style>
.custom-container {
  .theme-hope-content{
    margin: 0;
    max-width: 100%;
  }
}
</style>
