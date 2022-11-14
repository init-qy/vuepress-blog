---
title: leetcode_319:灯泡开关
date: 2020-11-18 09:36:54
tag: ["leetcode", "算法"]
category: ["算法"]
---

## 题目

传送门：[灯泡开关](https://leetcode-cn.com/problems/bulb-switcher/ "灯泡开关")

> 初始时有 n 个灯泡关闭。
> 第 1 轮，你打开所有的灯泡。 第 2 轮，每两个灯泡你关闭一次。 第 3 轮，每三个灯泡切换一次开关（如果关闭则开启，如果开启则关闭）。
> 第 i 轮，每 i 个灯泡切换一次开关。 对于第 n 轮，你只切换最后一个灯泡的开关。
> 找出 n 轮后有多少个亮着的灯泡。

## 思路

开始思维很简单：如果我要知道 n 个灯泡的开关情况，只需要知道 n-1 个灯泡的情况+第 n 个灯泡的情况；而第 n 个灯泡的情况很显然跟它的因子个数相关。比如 12 有 6 个因子，经过偶数次开关，灯泡为暗。由此得到以下代码：

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

那么很显然，这个代码的时间复杂度为 O(n&sup2;)。
在 n=99999 时就已经超时了。

---

接下来，我对计算因子个数的方法进行了优化：

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

这比循环 n/2 次快了许多，但仍然在最后 9999999 时超时了。
看来按照一开始的思路注定是走不通了。

---

先上代码

```java
class Solution {
    public int bulbSwitch(int n) {
        return (int)Math.sqrt(n);//别问，问就是强转
    }
}
```

很神奇，但这是为什么呢？
在之前的思路中，我们都是通过计算一个数的因子个数来判断灯泡的亮暗情况。事实上，我们无需计算个数，只需知晓个数奇偶就行。通过观察发现，大部分因子都是成双成对的，只有一种可能，那就是平方数，只有平方数拥有奇数个因子，它们的灯泡才会亮。问题迎刃而解。

## 总结

这是一道很有意思的题，设置的非常巧妙。
~~妙啊~~
