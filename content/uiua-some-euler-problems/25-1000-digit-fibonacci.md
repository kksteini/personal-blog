+++
title = "25 - 1000-digit Fibonacci"
date = 2026-07-16
weight = 25
[extra]
doclink = "https://projecteuler.net/problem=25"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJx1kT9r20AYxvf7FC9RBwlb9qnQwaUNxIMhS4YoU0MI-nOWj1p35u5EFw-NC44jHOjgkjiUkKQtbSHgpUMgmzv2W7yfpEhyAqUOaDj0vM_7e-45CzqZMj2mIGYm4H39klgQiCxscN3MeBa4WqbMZVmfKXegZNhnqW4-f-F6lFI35gk3bpeHUgRRxAnB2RRn7_HTL7-9TQD2pG8UFwkAjj9C89nG4eEGHk8JwFYc70jT4aJScPwNNlsEYJelb5gCqBz449bGyfkQx-fLhee8ppjfYf6l8hdDq7nKhac3dg1qgPkHG8f3y4U3_H22XHjUwfxuszV8ZDqAtxe0mJz8tP98xnxEHYKzWRWdkA4PZcXP53g2Lb7TGxu_XtSKH_ncxdHREE-uaCU64AElxAI_lW-ZYdpAVyoot_B00GcpEyYwXApiAZ5c24Xi4PE1jo68NUY9YCwuTz2eFE9jmEo1scqNRe_Egh1pIJJKscjUIWRRkGkGsgsDxSKuuRR1YkGYGVCZ0NANtGn8D0p4EgjDo38ArQqwy0ymhAacXBLS5smTnfjt7cZWHD_RzL53APv0oGA_LFlLfhBXdL8v39XL_KtLrhZUpe71ZKYDEZN1QcqA-bxWJHlVtIXf7x9zgEf-ApbsKJk="
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "bigint"]
+++

## Problem

The Fibonacci sequence is defined by the recurrence relation:

> $F_n = F_{n - 1} + F_{n - 2}$, where $F_1 = 1$ and $F_2 = 1$.

Hence the first $12$ terms will be:

$$\begin{aligned}
F_1 &amp;= 1\\\\
F_2 &amp;= 1\\\\
F_3 &amp;= 2\\\\
F_4 &amp;= 3\\\\
F_5 &amp;= 5\\\\
F_6 &amp;= 8\\\\
F_7 &amp;= 13\\\\
F_8 &amp;= 21\\\\
F_9 &amp;= 34\\\\
F_{10} &amp;= 55\\\\
F_{11} &amp;= 89\\\\
F_{12} &amp;= 144
\end{aligned}$$

The $12$th term, $F_{12}$, is the first term to contain three digits.
What is the index of the first term in the Fibonacci
sequence to contain $1000$ digits?

## Towards a solution

### Simple Big Integer

Let's use our simple big integer module as seen previously in [chapter 20](@/uiua-some-euler-problems/20-factorial-digit-sum.md#module-time).
We'll narrow it down to the relevant parts.

```uiua
┌─╴SBI
  ToString  ← /$"__"⇌
  AddNotFin ← /↥ >9
  RemZer    ← ⨬(∘|↘¯1)=0⊸⊣
  Add       ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)
└─╴
```
