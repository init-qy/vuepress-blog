---
title: unity中调用安卓camera函数
date: 2023-07-17 15:35:00
tag: ["unity", "C#"]
category: ["Unity"]
---

`Unity` 本身提供了`WebcamDevice`, `WebcamTexture`这样的接口来支持对物理相机的访问，但是这些接口支持获取的参数太少了，因此需要我们在`Unity`中调用原生的函数获取相应的参数。

## 环境

因为`Android`或`Unity`版本变更很快，这里贴一下目前的环境：

- Unity 2021.3.19f1
- Android 12.0 API31 emulator

## 用法

以下代码是使用安卓`CameraCharacteristics`类获取可用`focal_length`和`sensor_info_physical_size`的例子。

```cs
var player = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
var activity = player.GetStatic<AndroidJavaObject>("currentActivity");
var cameraManager = activity.Call<AndroidJavaObject>("getSystemService", "camera");
if (cameraManager != null)
{
    var CameraCharacteristics = cameraManager.Call<AndroidJavaObject>("getCameraCharacteristics", "0"); // device id

    AndroidJavaObject key_focal_lens = CameraCharacteristics.GetStatic<AndroidJavaObject>("LENS_INFO_AVAILABLE_FOCAL_LENGTHS");
    AndroidJavaObject key_sensor_size = CameraCharacteristics.GetStatic<AndroidJavaObject>("SENSOR_INFO_PHYSICAL_SIZE");
    float[] focal_lens = CameraCharacteristics.Call<float[]>("get", key_focal_lens);
    AndroidJavaObject sensor_size = CameraCharacteristics.Call<AndroidJavaObject>("get", key_sensor_size);
    float sensor_width = sensor_size.Call<float>("getWidth");
}
```

---

其中，如果是调用一个类中的方法，就使用`Call`，第一个参数为方法名，第二个参数可选，是传递的参数。
如果传参过程中需要用到它本来的类，比如上述代码中的`Key`，需要用`AndroidJavaObject`包装，只有一些基本类型(`int`, `float[]`)可以直接传递。
如果是调用一个类中的成员(fields)，则使用`GetStatic`，比如`java`中的`CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS`就可以用`GetStatic`获取。

## 参考

- <https://github.com/ricoh-live-streaming-api/android-sdk-samples/blob/main/unity-samples/unity-app/Assets/Scripts/CameraInfoList.cs>
- <https://github.com/huailiang/WebCam>
- <https://developer.android.com/reference/android/hardware/camera2/package-summary.html>
