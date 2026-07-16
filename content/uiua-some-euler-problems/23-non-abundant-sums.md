+++
title = "23 - Non-Abundant Sums"
date = 2026-07-13
weight = 23
[extra]
doclink = "https://projecteuler.net/problem=23"
pad="https://uiua.org/pad?src=0_19_0-dev_4__eJxlUU1rE0EYvs-veGBBEqr5qoIUPRTiIZcamvgDdpNJd2B3ZpnZsAS8NGDaLAo9NRK8BCN6yLGglyLUo__i_SXy7jbVxD3Nzvt8vuPh5HX_1RH6oXIIVeoQy9jYCSIV85_SSEOJxB8KD-WXhWoQwrcS2qRIrHRSp1uglUmESuxPAlmtPVD6obRyZKx8zCArC3aaGQTW14NQuh0ou91PoBxcZDJpj9A8hJMDo4cOI2MRy11S4fyXNfJdyqxG7emz_3jCQ99OMIpUkih9hpTbpwZN-HoIO9aab5XGxIxtocwMBmUqijCwvgu3e6mJjjstGR19yiFodoWGEN12rzjS9S1eNkDrJS1-gi5WND0Hvc9B-Q-6XIpuGyVu9pGm57S4oXxK6-Wv7wzotntCdNxxMNZDX6dlXUa_qB8UY7EdnYzjQFpXSuVLmq_-odHFqvW82Tzk5m_0wMQxvxk3iJSWDoGMTLYtXzaz5sz6MYR3rF0mban7bVPhpbP38m5D81WlTrMvoMscezme7F9UOQTKFN7bh2lvHN9nvr4tNjJfM6YFWtyAPsxA81X9APT1Hc3XaO2rlmm4MO42vz9xELZhofzzjonwqth7KeE9Ssp24g-5vSSM"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

A perfect number is a number for which the sum of its proper divisors is exactly
equal to the number. For example, the sum of the proper divisors of $28$ would
be $1 + 2 + 4 + 7 + 14 = 28$, which means that $28$ is a perfect number.

A number $n$ is called deficient if the sum of its proper divisors is less than
$n$ and it is called abundant if this sum exceeds $n$.

As $12$ is the smallest abundant number, $1 + 2 + 3 + 4 + 6 = 16$, the smallest
number that can be written as the sum of two abundant numbers is $24$. By
mathematical analysis, it can be shown that all integers greater than $28123$
can be written as the sum of two abundant numbers. However, this upper limit
cannot be reduced any further by analysis even though it is known that the
greatest number that cannot be expressed as the sum of two abundant numbers is
less than this limit.

Find the sum of all the positive integers which cannot be written as the sum of
two abundant numbers.

## Preparation

### Proper Divisors

We've talked about how to get proper divisors in [chapter 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#reducing-the-search-space)
and in [chapter 21.](@/uiua-some-euler-problems/21-amicable-numbers.md#better-crunch)
*Feel free to go through the deep dive there.*

What we learn from these chapters are these formulas:

```uiua
    PDS ← ▽=0⤚◿⇡₁⌊⊸√
    PD  ← ↘₁◴⊂⤚÷ ⊸PDS
```

The short version is that `PDS` gets proper divisors up to the square root
of a number, since factors are pairwise, and `PD` divides the original number
by the `PDS` factors while correcting for double and self-counting.

### Abundancy

According to the definition, an abundant number is one whose proper divisors exceed
it when summed. A straightforward check is to use the proper divisor function,
preserve the number with `by`, sum up the divisors and then compare.

Let's build that up step by step for $12.$

```uiua
    ⊸PD 12
12
[6 4 1 2 3]

    reduce add ⊸PD 12
    /+ ⊸PD 12
12
16

    lt /+ ⊸PD 12
    < /+ ⊸PD 12
1
```

Seems to work for $12.$
Let's store this as a function, have it generate some abundant
candidates and compare with a [known source (OEIS-A005101)](https://oeis.org/A005101).

```uiua
    IsAbundant ← < /+ ⊸PD

    add,12 where rows IsAbundant range,12 60
    +₁₂ ⊚ ≡IsAbundant⇡₁₂60
[12 18 20 24 30 36 40 42 48 54 56 60]
```

Yup. Our numbers agree with the OEIS.

## Solution

### Range elimination

>NOTE: This solution only works in the repl.
>
> It will run into memory issues in the pad.

One way we might solve this is to generate a list of abundant numbers, then generate
all their combinations of size $2$ and add them together. Those would be
our abundant sums.

We could then identify which numbers from $0$ to the upper bound are missing from
those abundant sums.

We are given an upper bound of $28123$ and we know that the smallest abundant number
is $12.$

Therefore, we can generate abundant numbers up to $28123-12=28111$ for this test.

---
Let's generate the abundant numbers and store them.

```uiua
AbundantNumbers ← ⊚≡IsAbundant ⇡28111
```

Next, we'll use [tuples](https://uiua.org/docs/tuples)
to generate combinations of abundant numbers for us to sum.
We must use `le` (or `ge`) for the operator since we want
to include combinations like $12+12.$

So, what do these combinations look like?

```uiua
    ↙₅ ⧅≤ 2 AbundantNumbers
╭─
╷ 12 12
  12 18
  12 20
  12 24
  12 30
        ╯

    ↙¯5 ⧅≤ 2 AbundantNumbers
╭─
╷ 28100 28104
  28100 28110
  28104 28104
  28104 28110
  28110 28110
              ╯
```

Yup. We're gonna get some useless calculations, around half of them.
We'll filter them later.

Since we get a list of arrays, we can reduce each one for the sum
of each pair of abundant numbers.

```uiua
    rows reduce add tuples le 2 AbundantNumbers
    ≡/+ ⧅≤ 2 AbundantNumbers
[24231241 ℝ: 24-56220 μ28084.7758]
```

We're going to get some repeats.
Let's `sort` and `dedup`.

> Why not just `dedup`?
> See [sortedness flags](https://www.uiua.org/docs/optimizations#sortedness-flags)
> in the interpreter documentation.

```uiua
    dedup sort ≡/+ ⧅≤ 2 AbundantNumbers
    ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
[53848 ℝ: 24-56220 μ28370.2914]
```

Since we have pairs like $28100,28104$ we know that we need to
throw away a lot of calculations. Let's only keep numbers
below the given threshold.

```uiua
    keep by le 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
    ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
[26667 ℝ: 24-28123 μ14673.0324]
```

Great. Now let's create a range of all numbers from $0-28123$
and check whether they are a member of the abundant sums.

```uiua
    memberof ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
    ∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
[26667 ℝ: 0-1 μ1]
```

Hmm. We should get $28123$ boolean flags. Likely just the `member`
that's backwards. Let's fix it with `bw`.

```uiua
    ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
[28123 ℝ: 0-1 μ0.9482]
```

Great. Now, let's keep those numbers that are **not** members.
That will be our unreachable-by-abundant-sums numbers.

```
    where not ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
    ⊚ ¬ ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
[0  1  2  3  4  5  6  7  8  9  10 11 
 12 13 14 15 16 17 18 19 20 21 22 23 
 25 26 27 28 29 31 ...]

```

Great. It makes sense to see all numbers below 24 since the lowest reachable should be the
sum of $12 + 12$, followed by $30$ for $12 + 18.$

This is exactly what we see. Let's sum them up then!

```uiua
    /+ ⊚ ¬ ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers
4179871
```

And that's our answer!

#### How fast?

Half a second!

```
    perf(/+ ⊚ ¬ ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers)
    ⊙◌⍜now(/+ ⊚ ¬ ˜∊ ⇡ 28123 ▽ ⊸≤ 28123 ◴ ⍆ ≡/+ ⧅≤ 2 AbundantNumbers)
0.45714712142944336
```

### Something that works in the pad

We can adapt the solution above to something that skirts around the memory issue.
Trying to create a great amount of combinations, with tuples, is not the way.
What we could do instead is to generate the range $0-28123$, and then calculate
the boolean flags in place.

We can then, for each number $r$ in the range $0-28123$, calculate $c = r - a_n$,
for all $a_n$ in the `AbundantNumbers`.
After we've done that we can check if our candidate $c$ is a member of `AbundantNumbers`.
If that's the case, then it means that $r$ is the sum
of some $a_n$ and some $c$, both of which are abundant numbers.

```uiua
    ≡(/↥ ∊AbundantNumbers -AbundantNumbers) ⇡28123
[28123 ℝ: 0-1 μ0.9482]
```

This is already a boolean array where we want to keep the non-matches.
We do that the same way as before with `reduce add where not`.

```uiua
    +⊚¬≡(/↥ ∊AbundantNumbers -AbundantNumbers) ⇡28123
4179871
```

That again is our answer.

#### Fast enough?

For the $60$ second limit, it passes.

```uiua
    ⊙◌⍜now(/+⊚¬≡(/↥ ∊AbundantNumbers -AbundantNumbers) ⇡28123)
13.063000202178955
```
