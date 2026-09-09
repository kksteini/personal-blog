+++
title = "30 - Digit Fifth Powers"
date = 2026-09-09
weight = 30
[extra]
doclink = "https://projecteuler.net/problem=30"
toc = true
pad = "https://www.uiua.org/pad?src=0_19_1__IyBTZWU6IAojIGFudWIuaXMvdWl1YS1zb21lLWV1bGVyLXByb2JsZW1zLzMwLWRpZ2l0LWZpZnRoLXBvd2Vycwriipnil4zijZxub3coLyvilr3iirg9LyvijYnigb814oq44oql4oKB4oKAIOKHoeKCgjM1NDI5NCkK"
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

Surprisingly there are only three numbers that can be written as the sum of
fourth powers of their digits:

$$ \begin{align}
1634 &amp;= 1^4 + 6^4 + 3^4 + 4^4\\\\
8208 &amp;= 8^4 + 2^4 + 0^4 + 8^4\\\\
9474 &amp;= 9^4 + 4^4 + 7^4 + 4^4
\end{align}
$$

_As $1 = 1^4$ is not a sum it is not included._

The sum of these numbers is $1634 + 8208 + 9474 = 19316.$
Find the sum of all the numbers that can be written as the sum of
fifth powers of their digits.

## Reducing the search space

The biggest contributor to any number will be $9^5 = 59049.$

Let's look at a couple of sequences of $9$s.

$$ 9 = 9^5 \times 1 = 59049 $$
$$ 99 = 9^5 \times 2 = 118098 $$
$$ 999 = 9^5 \times 3 = 177147 $$
$$ 9999 = 9^5 \times 4 = 236196 $$
$$ 99999 = 9^5 \times 5 = 295245 $$
$$ 999999 = 9^5 \times 6 = 354294 $$

When we hit the number $999999$, $6$ digits, the 5th power digit
sum is smaller than the digit itself.
The actual limit is going to be lower but we can
say that any number above $354294$ is going to be out
of reach.

So, the limit we'll work with is $354294.$

## Solving the example

We'll solve for 4th power sums.
Let's assume that we have reduced the limit to $10000$ for all 4th power
digit sums. What does our process look like?

For any number, we can get the digits with `base,10`.
Does that work pervasively?
We'll look at a small demo array first. Let's use
two of the three 4th power digit sums that are the
same as their digits so that the test is at least worth something.

```uiua
    by base,10 [15 8208 999 1634 1234]
    ⊸⊥₁₀ [15 8208 999 1634 1234]
[15 8208 999 1634 1234]
╭─
╷ 5 1 0 0
  8 0 2 8
  9 9 9 0
  4 3 6 1
  4 3 2 1
          ╯
```

Yes. It does. What about `pow,4`?

```uiua
    ⁿ4 ⊥₁₀ [15 8208 999 1634 1234]
╭─
╷  625    1    0    0
  4096    0   16 4096
  6561 6561 6561    0
   256   81 1296    1
   256   81   16    1
                      ╯
```

Great so far.
Now we need to sum up each number.
The problem here is that `reduce add` will
add together these arrays, line by line.
We need each column to represent the powers
of the digits but not the row.

Therefore, we have to `trans` before `reduce add`.

```uiua
# Transition first
    ⍉ ⁿ4 ⊥₁₀ [15 8208 999 1634 1234]
╭─
╷ 625 4096 6561  256 256
    1    0 6561   81  81
    0   16 6561 1296  16
    0 4096    0    1   1
                         ╯

# Then reduce add
    /+ ⍉ ⁿ4 ⊥₁₀ [15 8208 999 1634 1234]
[626 8208 19683 1634 354]
```

Nice. Now, let's reintroduce `by` before `base,10` so that we can compare.

```uiua
    /+ ⍉ ⁿ4 ⊸⊥₁₀ [15 8208 999 1634 1234]
[15 8208 999 1634 1234]
[626 8208 19683 1634 354]
```

Let's keep all numbers that match.

```uiua
    keep by eq /+ ⍉ ⁿ4 ⊸⊥₁₀ [15 8208 999 1634 1234]
    ▽ ⊸= /+ ⍉ ⁿ4 ⊸⊥₁₀ [15 8208 999 1634 1234]
[8208 1634]
```

Great. We get back the expected numbers.
Let's try it over the range $2-10000.$

```uiua
    ▽ ⊸= /+ ⍉ ⁿ4 ⊸⊥₁₀ ⇡₂10000
[1634 8208 9474]
```

Nice! We get the correct ones and the correct ones only.
Then we simply sum them up.

```uiua
    /+ ▽ ⊸= /+ ⍉ ⁿ4 ⊸⊥₁₀ ⇡₂10000
19316
```

## Solution

We'll simply adapt our demo program to the new limit and powers of $5$

```uiua
    /+▽⊸=/+⍉ⁿ5⊸⊥₁₀ ⇡₂354294
443839
```

### Fast?

```uiu
    ⊙◌⍜now(/+▽⊸=/+⍉ⁿ5⊸⊥₁₀ ⇡₂354294)
0.043565988540649414
```

Well under a second. I'm happy.
I hope you are happy too :)
