---
title: Proceso de desarrollo lvgl
date: 2024-05-23 11:16:32
tag:
  - lvgl
category:
  - desarrollo front-end
---

## Background

Acabo de tomar un proyecto para desarrollar en `C++` y debido a que nunca antes me había involucrado en este tipo de desarrollo, he decidido documentar el proceso aquí, al mismo tiempo que conmemoro aproximadamente 20 días de tiempo de desarrollo. Aproximadamente el 50% del tiempo lo dediqué a familiarizarme con el desarrollo de `lvgl`, su proceso de renderizado, sintaxis, API, etc. El 30% restante lo empleé en compilar, probar, y solo el tiempo restante lo invertí en la escritura de código real. Durante este proceso, la lógica recién agregada hizo que las ramas de código correspondientes fueran creciendo constantemente, lo que significó que me llevaría más tiempo comprender el código más adelante. Al final, logré completar la tarea, pero no quedé satisfecho con la robustez, limpieza y legibilidad del código en general.

## Estilo

Debido a la falta de tiempo, no instalé ningún complemento de gestión de estilo de codificación adecuado, y el proyecto original tampoco tenía una convención de estilo unificada, lo que ocasionaba la mezcla de tabulaciones y espacios, la alineación de métodos, entre otros problemas. Por lo tanto, solo pude mantener un estilo coherente en las páginas que recién agregué. Mantener un estilo de código uniforme es una actividad muy rentable en términos de inversión, ya que no solo facilita la lectura del código, sino que también facilita el aprendizaje para quienes lo aborden más adelante. Este aspecto es especialmente crucial para la salud de un proyecto.

## Código compartido

El desarrollo de código compartido es clave. Me he dado cuenta de que en `C++` se tiende a reinventar la rueda, pero no es necesario crear una nueva instancia de la misma rueda para cada página en un proyecto. Lo mismo ocurre con las modificaciones de estilos de interfaz gráfica: por ejemplo, la forma en que se desactiva y activa un botón que aparece en casi todas las páginas. Considero que estos aspectos pueden abstraerse para evitar tener que configurar repetidamente el color del texto, el color de fondo, etc. Por ejemplo:

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

Esta es una solución simple pero necesaria, al igual que `element-ui` reduce considerablemente la carga mental del desarrollo frontend, un componente de UI relativamente completo podría hacer lo mismo, pero lamentablemente `lvgl` no lo ofrece, y tampoco este proyecto.

Al parecer, `C++` no cuenta con un sistema de gestión de paquetes similar a `npm`, lo que dificulta el proceso de referencia de bibliotecas, y tampoco cuenta con una comunidad de código abierto como esa. Además, el alto costo de actualizar las versiones y el enfoque en la situación de hardware específica complican la posibilidad de migrar o adaptar un proyecto. Es común encontrarse con este problema al trabajar en un nuevo proyecto manteniendo uno anterior.

## Integración de datos

La integración con las interfaces es uno de los problemas más complicados. Dado que solo encontré la biblioteca cJSON, me centraré en los problemas relacionados con la integración de datos a través de cJSON.

1. Anidamiento: Para desglosar datos con varios niveles de anidamiento, se requiere un esfuerzo mayor para extraer los valores correspondientes, y si hay varios arrays anidados, los bucles `for` pueden convertirse en un desastre.
2. Modificación: Cuando necesitas realizar modificaciones en los datos por ciertas necesidades, debes prestar atención a las diferencias en las referencias para asegurarte de que los datos originales no se vean afectados.
3. Variables: Almacenar las variables de manera adecuada requiere una atención adicional a las diferencias entre `char[]`, `char*`, y `string`, y dominar las operaciones de asignación y conversión entre ellas.
4. Paso de valores: Si necesitas enviar un objeto cJSON* como una variable, primero puedes convertirlo en un `char*`, lo cual podría ser útil en caso de que ocurran errores desconocidos.

## Rendimiento

`C++` es rápido y también `lvgl`. Anteriormente, pensaba que crear un `map` para hacer coincidir el índice de un `button` en un `vector` mejoraría la eficiencia del proceso, pero cuando intenté obtener el índice mediante un bucle `for`, no noté que la eficiencia se redujera, quizás debido al tamaño de los datos. En resumen, es mejor usar bucles `for`, a pesar de que no sean tan legibles, al menos son fáciles de implementar.

Implementar selección múltiple en varias capas con `lvgl` resultó ser doloroso, pero esta funcionalidad compleja ya representa el mayor reto de este proyecto. Diseñar una estructura de datos adecuada podría simplificar el trabajo considerablemente, y en lo que respecta a la interfaz gráfica, no es necesario preocuparse demasiado, ya que incluso con un bucle `for`, se pueden cumplir los requisitos básicos.

Muchos principios de diseño de `lvgl` se inspiran en `css`, pero es importante confirmar su versión antes de utilizarlo. Además, `lvgl` no es HTML, por lo que no se ajusta automáticamente, por lo que si necesitas cambiar su posición, recuerda ajustar también la posición de sus elementos secundarios.

## Conclusión

`lvgl` es fácil de usar, incluso para alguien como yo, que no tiene un gran dominio de `C++`, puedo usarlo para implementar funcionalidades. Sin embargo, en términos de rendimiento, `lvgl` no proporciona una gama completa de componentes funcionales; esa tarea debería ser delegada a la arquitectura del proyecto para su posterior encapsulación. De lo contrario, la mezcla de funciones y negocios en las páginas aumentaría la carga mental.

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
