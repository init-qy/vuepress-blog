---
title: "leetcode_319: Interruptor de bombillas"
date: 2020-11-18 09:36:54
tag:
  - leetcode
  - aritmética
category:
  - aritmética
---

## Título

Enlace: [Interruptor de bombillas](https://leetcode-cn.com/problems/bulb-switcher/ "Interruptor de bombillas")

> Al principio, hay n bombillas apagadas.
> En la primera ronda, enciendes todas las bombillas. En la segunda ronda, apagas cada dos bombillas. En la tercera ronda, cambias el estado de cada tres bombillas (si están apagadas, las enciendes; si están encendidas, las apagas).
> En la i-ésima ronda, cambias el estado de cada i bombillas. En la última ronda, solo cambias el estado de la última bombilla.
> Encuentra cuántas bombillas están encendidas después de n rondas.

## Idea

La idea inicial es bastante simple: si quiero saber el estado de n bombillas, solo necesito saber el estado de n-1 bombillas + el estado de la n-ésima bombilla; y el estado de la n-ésima bombilla está claramente relacionado con la cantidad de factores que tiene. Por ejemplo, 12 tiene 6 factores, por lo que después de un número par de cambios, la bombilla estará apagada. De aquí se obtiene el siguiente código:

```java
class Solution {
    public int bulbSwitch(int n) {
        if(n==0) return 0;
        if(n==1) return 1;
        int r = 1;
        for(int i=1;i<=n/2;i++){
            if(n%i==0) r++;
        }
        return bulbSwitch(n-1) + r%2;
    }
}
```

Sin embargo, es evidente que la complejidad temporal de este código es O(n&sup2;). Ya se agota el tiempo cuando n=99999.

---

A continuación, optimicé el método para calcular la cantidad de factores:

```java
class Solution {
    public int bulbSwitch(int n) {
        if(n==0) return 0;
        if(n==1) return 1;
        int r = dcpCount(n);
        return bulbSwitch(n-1) + r%2;
    }
    public int dcpCount(int x){//所有因子的个数（包括1）
        int ans = 1;
        for(int i = 2; i * i <= x; i++){
            if(x % i == 0){
                int temp = 0;
                while(x % i == 0){
                    x /= i;
                    temp++;
                }
                ans *= (temp+1);//运用上面的公式，计算所有因子的个数
            }
        }
        if(x > 1) ans *= 2;
        return ans;
    }
}
```

Esto es mucho más rápido que iterar n/2 veces, pero aún se agota el tiempo cuando n=9999999. Parece que no se puede seguir adelante con la idea inicial.

---

Aquí está el código:

```java
class Solution {
    public int bulbSwitch(int n) {
        return (int)Math.sqrt(n);//别问，问就是强转
    }
}
```

Es sorprendente, pero ¿por qué?
En el enfoque anterior, calculamos la cantidad de factores de un número para determinar si la bombilla está encendida o apagada. De hecho, no necesitamos calcular la cantidad, solo necesitamos saber si es par o impar. Al observar, se descubre que la mayoría de los factores vienen en pares, solo hay una posibilidad de que haya una cantidad impar de factores, y eso es cuando el número es un cuadrado perfecto. Solo los cuadrados perfectos tienen una cantidad impar de factores, y sus bombillas estarán encendidas. El problema se resuelve fácilmente.

## Conclusión

Este es un problema muy interesante, muy ingenioso en su planteamiento.
~~Qué genial~~

> Este post está traducido usando ChatGPT, por favor [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) si hay alguna omisión.
