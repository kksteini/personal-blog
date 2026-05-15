+++
title = "1 - Multiples of 3 or 5"
date = 2026-04-28
weight = 1
[extra]
doclink = "https://projecteuler.net/problem=1"
toc = false

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

If we list all the natural numbers below $10$ that are multiples of $3$ or $5$,
we get $3, 5, 6$ and $9$. The sum of these multiples is $23$.
Find the sum of all the multiples of $3$ or $5$ below $1000$.

## Foundations and research before we begin

See if you know these concepts before moving on

### Modulo

Modulo is a standard operation in most programming languages.
It allows you to ask *what is the remainder when I divide a number with
another number?*

In Uiua, writing `mod a b` will ask the question *what is the remainder of b when
divided by a?*

Let's see some examples:

```uiua
# Hint: mod gets formatted to ◿
    ◿ 5 14
4
    ◿ 6 13
1
    ◿ 2 14
0
    ◿ 3 15
0
    ◿ 5 15
0
```

**What does it mean?**
Take for example `mod 5 14`. Why does it result in 4?
Personally, I reason about it like so.
See how close you can get without going over, and then calculate the difference.

```plain
Target: 14
5 * 1 = 5   <- not enough
5 * 3 = 15  <- Too much, 15 > 14
5 * 2 = 10  <- Just right

Then: target - closest multiple without going over
14-10 = 4
```

You can also think about it in this way. What does the fractional part
of a division represent? It represents the remainder, does it not?
Let's keep with `mod 5 14`, but let's try another programming language:

```ruby
> 14.0 / 5
=> 2.8

# The whole part
> 5 * 2
=> 10

# The rational part
# The remainder
> 5 * 0.8
=> 4.0

# The modulo
> 14 % 5
=> 4
```

**Key insight**:
When `mod a b` results in 0, then it means
`b` is fully divisible, with no remainder, by `a`.

**Further reading**:

- <https://en.wikipedia.org/wiki/Modulo> (just the first section is fine)
- <https://en.wikipedia.org/wiki/Euclidean_division>
- - I also recommend searching for *integer division in programming*

### FizzBuzz

If you are unsure on what way to go to solve this problem, try looking at
discussions on FizzBuzz. This is (or was?) a common interview question for
entry level programmers and considerable literature exists.

## Towards the answer

We'll build up the answer from what we know.

We'll check a range of numbers and take their 3 and 5 modulo.
According to the **key insight**, we want to find all numbers whose
3 or 5 modulo results in 0, meaning that they are a multiple of either.

Let's create a range, starting at 1 (`mod 0 X` is dividing with 0)
and ending at 9, like the problem example.

```uiua
    range,1 9
    ⇡₁9
[1 2 3 4 5 6 7 8 9]
```

Let's take the 3 and 5 modulo. Let's also preserve the original range
with by.

```uiua
    by fork mod,3 mod,5 range,1 9
    ⊸⊃◿₃◿₅ ⇡₁9
[1 2 3 4 5 6 7 8 9]
[1 2 3 4 0 1 2 3 4]
[1 2 0 1 2 0 1 2 0]
```

Now we want all instances of 0s in either modulo. We can take the min
of these two arrays and then ask where it is 0 with `eq 0`.

```uiua
    =0↧⊸⊃◿₃ ◿₅ ⇡₁9
[1 2 3 4 5 6 7 8 9]
[0 0 1 0 1 1 0 0 1]
```

Now that we have a masking array we simply `keep` it.

```uiua
    ▽=0↧⊸⊃◿₃ ◿₅ ⇡₁9
[3 5 6 9]
```

and finally we can get the sum with `reduce add`

```uiua
    /+▽=0↧⊸⊃◿₃ ◿₅ ⇡₁9
23
```

## Solution

Given what we worked out above, we simply extend the range to 999 to check all
numbers under 1000.
The solution is then

```uiua
    /+▽=0↧⊸⊃◿₃ ◿₅ ⇡₁999
```
