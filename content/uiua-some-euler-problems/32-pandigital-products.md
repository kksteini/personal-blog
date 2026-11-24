+++
title = "32 - Pandigital Products"
date = 2026-10-28
weight = 32
[extra]
doclink = "https://projecteuler.net/problem=32"
toc = true
pad="https://www.uiua.org/pad?src=0_20_0-dev_1__eJxzCVaAgUdtExS0HzU1KjzqmmVr8Gj6foVH7QvB_J4uhUddOx51zOIKKMpPCUotLs0pASt_1DX_UVPzo-kLD29_1LXDJZjLI7E4IDEPpAosb2to8Gj57kfTtzzqajJ4NHPto66lj5oaHzU1cDkn5qVkpiSWpBaDFR7aAJd6tLz1UecCBROo7ZZcXPraj6btBTmgc6GG_qO2pY86FyLb09uJcJWmAsJgLgD0_2qn"
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

We shall say that an $n$-digit number is pandigital if it makes use of all the
digits $1$ to $n$ exactly once; for example, the $5$-digit number, $15234$,
is $1$ through $5$ pandigital.

The product $7254$ is unusual, as the identity, $39 \times 186 = 7254$,
containing multiplicand, multiplier, and product is $1$ through $9$ pandigital.

Find the sum of all products whose multiplicand/multiplier/product identity can
be written as a $1$ through $9$ pandigital.

_HINT: Some products can be obtained in more than one way so be sure to only
include it once in your sum._

## Candidates

Before we code anything, let's think a little about what we expect to find.
Can we restrict our search space? We can hunt for an upper limit with $9s$ and
minimals with $1s$ since $0$ is not included in the pandigital consideration.

We're looking for products on the form $A \times B = C$ such that the digits
of all run from $1$ to $9$ for a total of $9$ digits.

### Upper bound

Can we set an upper bound on the amount of digits in any one term?

> I'm going to represent a number with $x$ digits as $d_x$.

It's fairly easy to see that $5$ digits is too much.

$$ 1 \times 11111 = 11111 $$
$$ d_1 \times d_5 = d_5$$

and

$$ 9 \times 99999 = 899991 $$
$$ d_1 \times d_5 = d_6 $$

Some $d_1 \times d_5$ will result in $d_5$ or a $d_6$, bringing the total
number of digits to $d_{11}$ or $d_{12}$.

That's more than $d_9$ so we rule out all candidates $d_x$ where $x>=5.$

What about a minimum?

### Restricting the rest

> This is a very dry section that goes through the rest of the available forms
> that the pandigital products can take. Feel free to skip
> to [generating the candidates](/uiua-some-euler-problems/32-pandigital-products#generating-the-candidates)

$d_1 \times d_1$ has a maximum of $d_2$ from $9 \times 9 = 81$ so that's ruled
out because the highest total is $d_4.$

$d_1 \times d_2$ has a maximum of $d_3$ from $9 \times 99 = 891$ so that's ruled
out as well since the total can not exceed $d_6.$

$d_1 \times d_3$ is max $d_4$ via $9 \times 999 = 8991$ and the total $d_8$ also falls short.

$d_2 \times d_2$ has a maximum of $d_4$ from $99 \times 99 = 9801$ and that's
ruled out because we can only get up to $d_8.$

---

We can have $d_1 \times d_4 = d_4$ for a total of $d_9$.
A trivial example is $1 \times 1111 = 2222.$
We can overshoot with $d_1 \times d_4 = d_5$ with all $9s$ in the multiplication.

We can have $d_2 \times d_3 = d_4$, for example $11 \times 111 = 1221$.
We can overshoot with all $9s$ to a total of $d_{10}.$

---

$d_3 \times d_3$ is impossible since the lowest we can go is
$111 \times 111 = 12321$ for a total of $d_{11}.$

This then also rules out $d_3 \times d_4$ and $d_4 \times d_4.$

### Generating the candidates

We can summarize our findings in the previous two sections as follows.

> We can only have pandigital products on the forms:
>
> $ d_1 \times d_4 = d_4$
>
> $ d_2 \times d_3 = d_4$

Both forms end in a final product of $d_4$, which is very fortunate.
This means we can derive some $d_2 \times d_3$ or $d_1 \times d_4$ from
candidates of size $d_4$ only.

Well, our candidates should be all permutations of $4$ digits from
$1$ to $9.$ If we read [the tuples docs](https://www.uiua.org/docs/tuples)
we see the following

> ≠(ne) will give all permutations of rows from the array.

```uiua
    tuple ne 4 range,1 9
    ⧅≠ 4 ⇡₁9
╭─
  3024×4 ℝ
   1-9 μ5
           ╯

# Let's see the first
# and last 4 to confirm
# that this does what we expect
    join fork take,4 take,`4 ⧅≠ 4 ⇡₁9
    ⊂ ⊃↙₄ ↙₋₄ ⧅≠ 4 ⇡₁9
╭─
╷ 1 2 3 4
  1 2 3 5
  1 2 3 6
  1 2 3 7
  9 8 7 3
  9 8 7 4
  9 8 7 5
  9 8 7 6
          ╯
```

We can convert these to numbers, instead of digit arrays, with
`un base,10`.

```uiua
    °⊥₁₀ [1 2 3 4]
4321
```

Ah, but it reverses `[1 2 3 4]` to $4321$.
Well, for every `[a,b,c,d]` in the candidate pool there is going to be a corresponding
`[d,c,b,a]`. If this wasn't the case, then we wouldn't have all permutations
of the elements chosen from the range $1$ to $9.$

So, we can just apply `unbase,10` directly to the list of candidates.

```uiua
°⊥₁₀⧅≠ 4 ⇡₁9
[4321 5321 ... <truncated> ... 4789 5789 6789]
```

You can sort the list and inspect it if you're not convinced that it
contains all permutations.

```uiua
⍆°⊥₁₀⧅≠ 4 ⇡₁9
[1234 1235 1236 ... <truncated> 9874 9875 9876]
```

Great. Now for the next pieces of the puzzle, we need to figure out
how we want to search for multiplicand/multiplier pairs based off of our candidates
and then how to check for pandigitalness.

### Multiplicand and multiplier pairs

For each $4$ digit number, we could generate proper divisors and divide by them
to create a list of multiplicand and multiplier pairs.

#### Proper divisors

I feel like I keep referencing [chapter 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#alternate-proper-divisors).
You can read that, but I feel like doing a new TLDR.

For the multiplicand/multiplier pairs we want to generate
unique factors, that is, each pair of factors appears only once.

For example, $16$ has the factors $1\ 2\ 4\ 8\ and\ 16.$
The pairs within those factors are

$$ 1 \times 16 $$
$$ 2 \times 8  $$
$$ 4 \times 4  $$

To cover this pair space sufficiently, we can cap
the search at $sqrt(N)$ and the rest of the factors
are then generated from division.

Let's get the range for division.

```uiua
    range,1 floor by sqrt 16
    ⇡₁ ⌊⊸√ 16
16
[1 2 3 4]
```

Check for divisibility with modulus and ask for them with
`where`

```uiua
    mod ⇡₁ ⌊⊸√ 16
    ◿ ⇡₁ ⌊⊸√ 16
[0 0 1 0]
    where=0◿ ⇡₁ ⌊⊸√ 16
    ⊚=0◿ ⇡₁ ⌊⊸√ 16
[0 1 3]
```

And finally a correction since `where` is 0-indexed.

```uiua
    +1⊚=0◿ ⇡₁ ⌊⊸√ 16
[1 2 4]
```

Great. We have a divisor function, suiting our purpose
as follows

```uiua
DS=+1⊚=0◿ ⇡₁ ⌊⊸√
```

### Putting the multiplicand, multiplier and the number together

Let's use $1236$ as an example.
The first half of the product we get using our `DS` function

```uiua
    by DS 1236
    ⊸DS 1236
1236
[1 2 3 4 6 12]
```

Now, the latter half we get by dividing each square root limited factor by the
product candidate. We need to use `below` to keep the product and the factors

```uiua
    below div by DS 1236
    ◡÷ ⊸DS 1236
1236
[1 2 3 4 6 12]
[1236 618 412 309 206 103]
```

Great. We can now create a matrix by coupling and joining the
factors/product combinations

```uiua
    couple ◡÷ ⊸DS 1236
    ⊟ ◡÷ ⊸DS 1236
1236
╭─
╷ 1236 618 412 309 206 103
     1   2   3   4   6  12
                           ╯

    join ⊟ ◡÷ ⊸DS 1236
    ⊂ ⊟ ◡÷ ⊸DS 1236
╭─
╷ 1236  618  412  309  206  103
     1    2    3    4    6   12
  1236 1236 1236 1236 1236 1236
                                ╯
```

Equivalently we can use `couple,3` instead and it will work the same way.

```uiua
    ⊟₃◡÷⊸DS 1236
╭─
╷ 1236  618  412  309  206  103
     1    2    3    4    6   12
  1236 1236 1236 1236 1236 1236
                                ╯
```

Let's store this way of getting the product and the result for multiplicative pairs
as a procedure

```uiua
    ProdResult ← ⊟₃◡÷⊸DS
```

### Counting the digits

Now, for each product and its multiplicative factors, we need to see if it contains
all digits from $1$ to $9$. Let's start again with $1236$

```uiua
    ProdResult 1236
╭─
╷ 1236  618  412  309  206  103
     1    2    3    4    6   12
  1236 1236 1236 1236 1236 1236
                                ╯
```

Well, we have six product/factors combinations here.
If we want to operate on them row-wise, we need to
transpose them first.

```uiua
    trans ProdResult 1236
    ⍉ ProdResult 1236
╭─
╷ 1236  1 1236
   618  2 1236
   412  3 1236
   309  4 1236
   206  6 1236
   103 12 1236
               ╯
```

Great. Let's now focus on one element out of this array.
We'll use `first` to do that. We can also use `last` or
pick any one to examine, it doesn't matter.
Anyway, how do we count its digits?

```uiua
    first⍉ProdResult 1236
    ⊢⍉ProdResult 1236
[1236 1 1236]
```

I can think of using `base,10` along with `flat` to isolate
the digits

```uiua
    base,10⊢⍉ProdResult 1236
    ⊥₁₀⊢⍉ProdResult 1236
╭─
╷ 6 3 2 1
  1 0 0 0
  6 3 2 1
          ╯
    flat⊥₁₀⊢⍉ProdResult 1236
    ♭⊥₁₀⊢⍉ProdResult 1236
[6 3 2 1 1 0 0 0 6 3 2 1]
```

Then we can deduplicate them and assert their length to be $9$ for $1-9$

```uiua
    dedup♭⊥₁₀⊢⍉ProdResult 1236
    ◴♭⊥₁₀⊢⍉ProdResult 1236
[6 3 2 1 0]
    len◴♭⊥₁₀⊢⍉ProdResult 1236
    ⧻◴♭⊥₁₀⊢⍉ProdResult 1236
5
    =9⧻◴♭⊥₁₀⊢⍉ProdResult 1236
0
```

Now, to stop considering one element we remove `first` and
wrap our logic in `row`

```uiua
    ≡(=9⧻◴♭⊥₁₀)⍉ProdResult 1236
[0 0 0 0 0 0]
```

Ok. So none of the $6$ product/result combos are pandigital.
We know we want to identify some products where any combination
of their multiplicative factors are pandigital. Therefore, we can
`reduce max` to get $1$ or $0$ depending on whether such
combination is found.

```uiua
    /↥≡(=9⧻◴♭⊥₁₀)⍉ProdResult 1236
0
```

The number $1236$ isn't a candidate then.
Let's store this procedure, however, as `HasPanProd`.

Though... hang on a minute. Didn't we introduce a $0$?
Looking back to our flattening.

```uiua
    ◴♭⊥₁₀⊢⍉ProdResult 1236
[6 3 2 1 0]
```

We need to account for this, also in cases where
there are no zeroes.

So, after we flatten, we should `join 0` and then `dedup`.
A true $1-9$ pandigital product will then be
a part of a 10-digit combination.

So, with that in mind we have

```uiua
HasPanProd ← =10⧻◴⊂0♭⊥₁₀
```

## Solution

Putting together all of the pieces we want to
iterate over all candidates `row(something) Candidates`
where `something` is our product expander and digit counter.

We've shown that this `something` is

```uiua
/↥≡HasPanProd ⍉ProdResult 1236
```

Well, let's iterate over the candidates and keep the hits.
What do we get?

```uiua
    ▽⊸≡(/↥ ≡HasPanProd⍉ProdResult) Candidates
[7632 7852 6952 7254 5346 4396 5796]
```

Ok cool. Those are the products.
Let's confirm one of them

```
    ▽≡⊸HasPanProd⍉ProdResult 7632
╭─
╷ 159 48 7632
              ╯
```

Yes, $159 \times 48 = 7632$ has all the digits from $1-9.$
The solution is therefore the sum of the products

```uiua
    /+▽⊸≡(/↥≡HasPanProd ⍉ProdResult) Candidates
45228
```

### Fast?

Fast enough, I dare say.

```uiua
    ⊙◌⍜now(/+▽⊸≡(/↥≡HasPanProd ⍉ProdResult) Candidates)
0.03257393836975098
```
