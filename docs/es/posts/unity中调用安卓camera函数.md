---
title: Llamando a la función de la cámara de Android en Unity.
date: 2023-07-17 15:35:00
tag:
  - unity
  - C#
category:
  - Unity
---

`Unity` itself provides interfaces such as `WebcamDevice` and `WebcamTexture` to support access to physical cameras, but these interfaces provide too few parameters. Therefore, we need to call native functions in `Unity` to obtain the corresponding parameters.

## Environment

Since `Android` or `Unity` versions change rapidly, here is the current environment:

- Unity 2021.3.19f1
- Android 12.0 API31 emulator

## Usage

The following code is an example of using the `CameraCharacteristics` class in Android to obtain the available `focal_length` and `sensor_info_physical_size`.

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

In the code above, if you are calling a method in a class, use `Call`, where the first parameter is the method name and the second parameter is optional and represents the arguments passed.
If the original class is needed during the argument passing process, such as the `Key` in the code above, it needs to be wrapped using `AndroidJavaObject`. Only some basic types (`int`, `float[]`) can be passed directly.
If you are accessing a member (fields) of a class, use `GetStatic`, for example, `CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS` in `java` can be obtained using `GetStatic`.

## References

- <https://github.com/ricoh-live-streaming-api/android-sdk-samples/blob/main/unity-samples/unity-app/Assets/Scripts/CameraInfoList.cs>
- <https://github.com/huailiang/WebCam>
- <https://developer.android.com/reference/android/hardware/camera2/package-summary.html>

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
