+++
title = "24 - Lexicographic Permutations"
date = 2026-07-16
weight = 24
[extra]
doclink = "https://projecteuler.net/problem=24"
pad = "https://uiua.org/pad?src=0_19_0-dev_4__wrDiiqXigoHigoAg4oeM4oqhIDk5OTk5OSDip4XiiaAgMTAg4oehIDEwCg=="
toc = true
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

A permutation is an ordered arrangement of objects. For example, 3124 is one
possible permutation of the digits 1, 2, 3 and 4. If all of the permutations
are listed numerically or alphabetically, we call it lexicographic order.
The lexicographic permutations of 0, 1 and 2 are:

> 012   021   102   120   201   210

What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4,
5, 6, 7, 8 and 9?

## Research

Permutations are what [tuples](https://www.uiua.org/docs/tuples) is for.
It would be very fortunate if `tuples` produces
permutations lexicographically.
Let's check.

> `≠` will give all permutations of rows from the array.

```uiua
    ⧅≠3 ⇡3
╭─       
╷ 0 1 2  
  0 2 1  
  1 0 2  
  1 2 0  
  2 0 1  
  2 1 0  
        ╯
```

Nice!

## Solution

Wowee trivial. We just adapt our parameters and get the millionth ordering.
*Remember that it is 1-indexed.*

```uiua
    ⊡ 999999 ⧅≠ 10 ⇡10
[2 7 8 3 9 1 5 4 6 0]
```

Great. Let's turn that into a number.
We can take our pick from `unbase,10 rev` or `parse reduce $"__"`

```uiua
    °⊥₁₀ ⇌ ⊡ 999999 ⧅≠ 10 ⇡10
2783915460
```

### How fast?

Fast enough.

```uiua
    ⊙◌⍜now(°⊥₁₀ ⇌ ⊡ 999999 ⧅≠ 10 ⇡10)
0.13539552688598633
```
