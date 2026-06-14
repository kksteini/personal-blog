+++
title = "10 - Summation of Primes"
date = 2026-06-14
weight = 10
[extra]
doclink = "https://projecteuler.net/problem=10"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "prime-numbers"]
+++

## Problem

The sum of the primes below $10$ is $2 + 3 + 5 + 7 = 17$.
Find the sum of all the primes below two million.

## Foundations

### Prime number checks with un reduce mul

*If you've recently looked at [chapter 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#prime-number-checks) or [chapter 7](@/uiua-some-euler-problems/07-10001st-prime.md#prime-number-checks-with-un-reduce-mul)
then this will be familiar and you can skip this section*.

**Click [to skip to solution](@/uiua-some-euler-problems/10-summation-of-primes.md#solution).**

#### Length check

What happens when `un reduce mul` is called on a prime?

```uiua
    °/× 19
[19]
    °/× 21
[3 7]
    °/× 23
[23]
    °/× 29
[29]
```

It seems that `un reduce mul` returns an array that contains $N$ and only $N$
when $N$ is prime.

Therefore, a prime check might be to check the length

```uiua
    IsPrime ← =1 ⧻ °/×
```

Let's get all primes under $100$. We can use `where` for this
after applying `IsPrime` to a range.
Since where is 0-indexed, we need to account for that with `+1`

```uiua
    +₁⊚ ≡IsPrime⇡₁100
[2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97]
```

#### Pervasion

Note that `un reduce mul` is pervasive.
Take the range $1-10.$

```uiua
    °/× ⇡₁10
╭─
╷ 1 1 1 1 1 1 1 2 1 1
  1 1 1 2 1 2 1 2 3 2
  1 2 3 2 5 3 7 2 3 5
                      ╯
```

Over this range, the largest collection of factors comes from $8$
which has prime factors $[2\ 2\ 2]$.
All other elements are padded with $1s.$
That does make sense since multiplying by $1$ doesn't change the result.
$1 * 2 * 5$ is just as much $10$ as $2 * 5.$

Well now, if a prime is entered, the last element of that column is the same
as the number which generated it.

```uiua
    °/× [7 9 11]
╭─
╷ 1 3  1
  7 3 11
         ╯
```

So if we get the last element of each

```uiua
    ⊣ °/× [7 9 11]
[7 3 11]
```

and preserve the original range for comparison

```uiua
    ⊣ ⊸°/× [7 9 11]
[7 9 11]
[7 3 11]
```

then primes is where these arrays are equal.

```uiua
    ▽ ⊸= ⊣ ⊸°/× [7 9 11]
[7 11]
```

---

We can then define.

```uiua
    IsPrimePervasive ← =⊙(≠1) ⊸=⊣ ⊸°/×
    +₁ ⊚ IsPrimePervasive ⇡₁10
[2 3 5 7]
```

Note that we need to correct for 1 as it is not a prime number.

#### Difference in performance

On single checks, both should be fast enough for our purposes.
But what about a range of numbers?

A very **very** informal rule to keep in mind.

$$If\ it's\ rows,\ then\ it's\ slows!$$

Let's benchmark the prime checks on half a million elements.

```uiua
    ⊙◌⍜now(+₁ ⊚ ≡IsPrime⇡₁500000)
    ⊙◌⍜now(+₁ ⊚ IsPrimePervasive⇡₁500000)
0.41751933097839355
0.032407283782958984
```

The pervasive version is about 10x faster than
the prime checker that needs rows.

## Solution

*If you've read through these sequentially, I apologize for the lack of innovation.
I'd love to showcase other methods, though. [<eulerproblems@anub.is>](eulerproblems@anub.is)*

Let's use the pervasive prime check.

```uiua
    IsPrimePervasive ← =⊙(≠1) ⊸=⊣ ⊸°/×
```

We can apply it directly on a range, with `by`, such that
a `keep` will filter it. Let's tackle the example first.

```uiua
    keep by IsPrimePervasive range,1 9
    ▽ ⊸IsPrimePervasive⇡₁9
[2 3 5 7]
```

This allows us to use the good ol' `reduce add`.

```uiua
    reduce add keep by IsPrimePervasive range,1 9
    /+ ▽ ⊸IsPrimePervasive⇡₁9
17
```

We expand the range to encompass the *under 2 million* condition.

```uiua
    reduce add keep by IsPrimePervasive range,1 1999999
    /+ ▽ ⊸IsPrimePervasive⇡₁1999999
142913828922
```

That's our answer!

#### Speed?

This runs under our 1 minute target.

```uiua
    perf(/+ ▽ ⊸IsPrimePervasive⇡₁1999999)
    ⊙◌⍜now(/+ ▽ ⊸IsPrimePervasive⇡₁1999999)
0.13756203651428223
```

Wowee! 10 problems already. Only 90 to go.
