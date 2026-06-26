+++
title = "9 - Special Pythagorean Triplet"
date = 2026-06-12
weight = 9
[extra]
doclink = "https://projecteuler.net/problem=9"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

A Pythagorean triplet is a set of three natural numbers, $a \lt b \lt c$,
for which,
$$a^2 + b^2 = c^2.$$
For example, $3^2 + 4^2 = 9 + 16 = 25 = 5^2$.

There exists exactly one Pythagorean triplet for which $a + b + c = 1000.$
Find the product $abc$.

## Et tu Brute force?

I suspect that this has a search space that is small enough to allow for
traversing its entirety within one minute.

### Generating numbers

It might be good to generate the permutations of all numbers between 1-999
without repeats. This is where [tuples](https://www.uiua.org/docs/tuples)
comes in.

> We can use < and > for permutations

Let's reason with a smaller range first, something like 1-4, and then expand
back to 1-999.

```uiua
    ⧅<2 ⇡₁4
╭─
╷ 1 2
  1 3
  1 4
  2 3
  2 4
  3 4
      ╯
```

For the Pythagorean triplet, if $c^2 = a^2 + b^2$ it must be
that $c > a$ and $c > b$. Therefore, this `tuples` operation gives us our
$a,b$ candidates.

The next step is therefore to calculate a $c$ such that $a+b+c = 1000$.
Let's add together each row while preserving them, and then subtracting
that from $1000.$

```uiua
    ≡(˜- 1000 ⊸/+)⧅<2 ⇡₁4
╭─
╷ 1 2
  1 3
  1 4
  2 3
  2 4
  3 4
      ╯
[997 996 995 995 994 993]
```

Yes, it's what we expect. Let's `join` it inside the row instead of
accumulating outside of it.

```uiua
    ≡(⊂˜- 1000 ⊸/+)⧅<2 ⇡₁4
╭─
╷ 997 1 2
  996 1 3
  995 1 4
  995 2 3
  994 2 4
  993 3 4
          ╯
```

### Calculating the condition

At this point we have an array of $c,a,b$ candidates, at least for the sum 1000.
How would we interact with them in Uiua?

Let's experiment with $[5\ 3\ 4]$, a relatively known triplet.

A straightforward method might be to raise it to the second power and
use the `fdt` alias for `fork drop take`.
We'll supply it with $1$.

```uiua
    ⊃↘↙ 1 ⁿ₂ [5 3 4]
[25]
[9 16]
```

From here, we `reduce add` on `both`

```uiua
    ∩/+ ⊃↘↙ 1 ⁿ₂ [5 3 4]
25
25
```

and then apply an
equality check.

```uiua
    = ∩/+ ⊃↘↙ 1 ⁿ₂ [5 3 4]
1
```

Let's store it in a function `F`.

```uiua
    F ← =∩/+ ⊃↘↙ 1 ⁿ₂
```

### Brute Solution

After collecting all the permutations of $c,a,b$ where their sum is $1000$,
we apply $F$ on each row.
We have to keep the match computations for selecting the triplet.
We already know that $3, 4, 5$ is such a triplet. Let's set up a toy version hunting
for $a+b+c=3+4+5=12$ to make sure our reasoning is sound.

```uiua
    ⊸≡F ≡(⊂˜- 12 ⊸/+)⧅<2 ⇡₁5
╭─
╷ 9 1 2
  8 1 3
  7 1 4
  6 1 5
  7 2 3
  6 2 4
  5 2 5
  5 3 4
  4 3 5
  3 4 5
        ╯
[0 0 0 0 0 0 0 1 0 0]
```

That seems to work. And keeping it?

```uiua
    ▽ ⊸≡F ≡(⊂˜- 12 ⊸/+)⧅<2 ⇡₁5
╭─
╷ 5 3 4
        ╯
```

Alright. Since it is still an array of arrays, we take the first result and
`reduce mul` to get the product that the problem requires.

```uiua
    /×⊢▽ ⊸≡F ≡(⊂˜- 12 ⊸/+)⧅<2 ⇡₁5
60
```

---

Out of interest, let's see what $c,b,a$ is before getting their products.

```uiua
    ▽⊸≡F ≡(⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999
╭─
╷ 425 200 375
              ╯
```

Finally.

```uiua
    /×⊢▽ ⊸≡F ≡(⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999
31875000
```

### How fast?

```uiua
    ⊙◌⍜now(/×⊢▽ ⊸≡F ≡(⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999)
1.000063419342041
```

Close to a perfect second. *Your kilometrage may vary*.

Notice that we have two rows. We can accumulate the condition
from inside the first row. Let's refactor this.

```uiua
    ▽ ≡(⊸F ⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999
╭─
╷ 425 200 375
              ╯
```

Is that faster?

```uiua
    ⊙◌⍜now(▽ ≡(⊸F ⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999)
1.0462837219238281
```

No, not really. We'll have to think of something else.

## Research

Hey computer! Show me "Pythagorean Triplet".

That search term netted me the [Pythagorean triple](https://en.wikipedia.org/wiki/Pythagorean_triple)
article on Wikipedia, a very promising title.

### Euclid's formula for triples

According to the article, we can generate Pythagorean triples using the formula

$$ a = m^2 - n^2$$
$$ b = 2\times m \times n$$
$$c = m^2 + n^2 $$

where $m > n > 0$.

We can generate the $m > n$ constraint with tuples.
One value is always larger than the other when using `<` or `>`.

See this annotated example. *I use trans to conserve space.*

```uiua
    ⍉ ⧅<2 ⇡₁5
╭─
╷ 1 1 1 1 2 2 2 3 3 4  # values for n
  2 3 4 5 3 4 5 4 5 5  # values for m
                      ╯
```

#### Generating

The laziest possible way I can determine an upper bound is when
$c=m^2+n^2 \ge 1000.$
It looks to grow the fastest so $c$ bounds the
total sum of $1000.$

If we fix $n$ as $1$ in that scenario, that leaves us with
$m^2 \ge 999$ for which the lowest value is $m=32$.

Translating the Euclidean formula into Uiua is semi straightforward.
Let's do a triple fork, where we calculate $c,a,b$ in that order. We'll then join
the three outputs so that we return an array.
This way it'll look similar to our previous
attempt.

```uiua
# Euclid = fork(C|A|B)
    Euclid ← ⊂₃⊃(+ ∩ⁿ₂|˜- ∩ⁿ₂|×2 ×)
```

Let's generate a triple.

```uiua
    Euclid 2 1
[5 3 4]
```

We'll use permutations up to 4 to see the whole triplet generation in action.

```uiua
    ≡(Euclid°⊂)⧅<2 ⇡₁4
╭─
╷  5  ¯3  4
  10  ¯8  6
  17 ¯15  8
  13  ¯5 12
  20 ¯12 16
  25  ¯7 24
            ╯
```

Seems like we're passing in $m$ and $n$ in the
wrong order. Luckily, `tuples` can generate permutations
in the other direction by changing `<` to `>`.
*You can also prepend Euclid with `bw`.*

```uiua
    ≡(Euclid°⊂)⧅>2 ⇡₁4
╭─
╷  5  3  4
  10  8  6
  13  5 12
  17 15  8
  20 12 16
  25  7 24
           ╯
```

Well, so is this working? Let's compare $c^2$ to $a^2 + b^2$ visually.

```uiua
    ≡(⊂∩(/+ⁿ₂)⊃↘↙1)≡(Euclid°⊂)⧅>2 ⇡₁4
╭─
╷  25  25
  100 100
  169 169
  289 289
  400 400
  625 625
          ╯
```

Yes, this is indeed generating Pythagorean triples.

#### Solution

Let's go up to 32 and see if constraining the sum
gives us the solution.

```uiua
    ▽⊸≡(=1000 /+)≡(Euclid°⊂)⧅>2 ⇡₁32
╭─
╷ 425 375 200
              ╯
```

and finally

```uiua
    /×⊢▽⊸≡(=1000 /+)≡(Euclid°⊂)⧅>2 ⇡₁32
31875000
```

#### Speedy?

Recall our previous version

```uiua
    ⊙◌⍜now(/×⊢▽ ⊸≡F ≡(⊂˜- 1000 ⊸/+)⧅<2 ⇡₁999)
1.000063419342041
```

Our new version

```uiua
    ⊙◌⍜now(/×⊢▽⊸≡(=1000 /+)≡(Euclid°⊂)⧅>2 ⇡₁32)
0.0015838146209716797
```

is hundreds of times faster.
