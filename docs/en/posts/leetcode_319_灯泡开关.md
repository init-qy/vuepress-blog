---
title: "Leetcode_319: Light Bulb Switch"
date: 2020-11-18 09:36:54
tag:
  - leetcode
  - arithmetic
category:
  - arithmetic
---

## Title

Link: [Bulb Switcher](https://leetcode-cn.com/problems/bulb-switcher/ "Bulb Switcher")

> There are initially n bulbs turned off.
> In the first round, you turn on all the bulbs. In the second round, you toggle every second bulb. In the third round, you toggle every third bulb (if the bulb is on, turn it off; if it is off, turn it on).
> For the i-th round, you toggle every i-th bulb. For the n-th round, you only toggle the last bulb.
> Find how many bulbs are on after n rounds.

## Approach

The initial thinking is simple: to determine the state of n bulbs, we only need to know the state of n-1 bulbs plus the state of the n-th bulb; and the state of the n-th bulb is obviously related to the number of its factors. For example, 12 has 6 factors, and after an even number of toggles, the bulb is off. Based on this, we can come up with the following code:

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

However, it is obvious that the time complexity of this code is O(n&sup2;). It already times out when n=99999.

---

Next, I optimized the method of calculating the number of factors:

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

This is much faster than looping n/2 times, but it still times out when n=9999999. It seems that the initial approach is not feasible.

---

Here is the code:

```java
class Solution {
    public int bulbSwitch(int n) {
        return (int)Math.sqrt(n);//别问，问就是强转
    }
}
```

It's quite magical, but why is it like this? In the previous approach, we calculated the number of factors of a number to determine the state of the bulb. In fact, we don't need to calculate the exact number, we just need to know if it's odd or even. By observing, we found that most factors come in pairs, except for one possibility: square numbers. Only square numbers have an odd number of factors, and their bulbs will be on. The problem is solved effortlessly.

## Summary

This is a very interesting problem with a clever design.
~~Amazing!~~

> This post is translated using ChatGPT, please [**feedback**](https://github.com/linyuxuanlin/Wiki_MkDocs/issues/new) if any omissions.
