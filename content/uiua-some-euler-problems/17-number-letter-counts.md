+++
title = "17 - Number Letter Counts"
date = 2026-07-03
weight = 17
[extra]
doclink = "https://projecteuler.net/problem=17"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxdkT1Lw1AUhvfzK17o0hCliW2VDgpCBTcdsolD21xtQW8gH-KQQVO0elFwq0NBahEXwVVwa0f_xfklcmJTqxku5OZ93ufk3hKaveNeHFETfP2AAwIcVFFFnYAaaqgSUEcdNTokKsFTOkJZnXdOEl8hVkpHFnlLrIN1rM8Z6djI33PWdVbdBu0swqKR-upcU-jmqm20E93pIjhCO-hFiANQCa1OjEAj7iqE6kyFkfLRbkVqxXWoBNnoBVoYSejktK1C2tZ-tN8KY8gj9tmQs_5siOkb396zeQY_jSq2rOVNzvr8-mnRbqL9UM1BgewcG2DLZfPBN4-YDb9GbMZogs1zwSKHPaX0P2Oe3WEzEQ3fTyR9yWY8fV9LHYvyaygQIfK8VE9IDv1PW_7Nk5Lfgj2tvG6QRC3t_4Rcl6hi8-24XLHZZJxdsemXi7NIl_8vLeZNF2OkhdTiwR2bFxk2u7DAgzFnl41GY1lINn0DKIPbCA=="

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

If the numbers $1$ to $5$ are written out in words: one, two, three, four, five,
then there are $3 + 3 + 5 + 4 + 4 = 19$ letters used in total.
If all the numbers from $1$ to $1000$ (one thousand) inclusive were written out
in words, how many letters would be used?

**NOTE:** Do not count spaces or hyphens. For example, $342$ (three hundred and
forty-two) contains $23$ letters and $115$ (one hundred and fifteen)
contains $20$ letters. The use of "and" when writing out numbers is in
compliance with British usage.

## First, an apology

I didn't really think that this was an interesting problem to solve with Uiua.
I don't feel like doing a thorough write-up of this one either.
Since I suffer from ADHD there is no way around this, lmao, (that's a lie).

Just for completeness' sake though, I'll include the solution
I came up with. It's not the best one and frankly it is hard to read and understand.

If you like, try dissecting it and figuring out how it works.

---

The basic idea is to create a pipeline which feeds the digits, as an array, to functions
that figure out how many letters are in those components.

I used `base,10` and reversed it to make it easier to reason about.

The tens, for example, have the teens (10-19) zeroed out and are instead handled
in the `TeenPart` pipeline.

## Solution

You can take a look at the solution in the pad at the top of this article.
Otherwise, here's a fun read.

```uiua
D ← [
  0 3 3 5
  4 4 3
  5 5 4
]

# Tens (exclude teens)
T ← [
  0 0 6 6
  5 5 5
  7 6 6
]

# 10-19
E ← [
  3 3 3
  3 4 3
  4 4 3
  4
]

# A bunch of bois to 
# act on the reversed base,10
# version of the number
AndsPart     ← ×₃× ¬≍⊢ ⟜/+ ⟜(=₃⧻)
HundredsPart ← + ×₇ >1⊸∘ ×˜⊡ D ⊢⟜(=₃ ⧻)
TeenPart     ← ×˜⊡E⊣ ⟜⍣(=₁⊡¯2|0)
DigitPart    ← ˜⊡D ⊣
TensPart     ← ˜⊡T⍣(⊡¯2|0)
OneThousand  ← 11

/+≡(/+⊂₅⊃(AndsPart|HundredsPart|TeenPart|DigitPart|TensPart)⇌⊥₁₀) ⇡₁999
OneThousand
+
```
