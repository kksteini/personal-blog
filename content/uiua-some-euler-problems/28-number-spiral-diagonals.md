+++
title = "28 - Number Spiral Diagonals"
date = 2026-09-08
weight = 28
[extra]
doclink = "https://projecteuler.net/problem=28"
toc = true
pad = "https://uiua.org/pad?src=0_19_1__IyBTZWU6CiMgYW51Yi5pcy91aXVhLXNvbWUtZXVsZXItcHJvYmxlbXMvMjgtbnVtYmVyLXNwaXJhbC1kaWFnb25hbHMvCi8rXCviioIx4pa9NMOX4oKC4oeh4oKBNTAwCg=="
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

Starting with the number $1$ and moving to the right in a clockwise direction a
$5$ by $5$ spiral is formed as follows:
<pre><span style="color:#ff6600;"><b>21</b></span> 22 23 24 <span style="color:#ff6600;"><b>25</b></span>
20  <span style="color:#ff6600;"><b>7</b></span>  8  <span style="color:#ff6600"><b>9</b></span> 10
19  6  <span style="color:#ff6600"><b>1</b></span>  2 11
18  <span style="color:#ff6600"><b>5</b></span>  4  <span style="color:#ff6600"><b>3</b></span> 12
<span style="color:#ff6600"><b>17</b></span> 16 15 14 <span style="color:#ff6600"><b>13</b></span></pre>

It can be verified that the sum of the numbers on the diagonals is $101$.
What is the sum of the numbers on the diagonals in a $1001$ by $1001$ spiral
formed in the same way?

## Is there a pattern?

The spiral starts at $1$ and then the diagonals zoom off in four directions.
Let's ignore $1$ for now and just focus on the corners of the diagonals.
What can we tell about the first four corners?
We have $3\ ,5\ ,7\ and\ 9$ and there's a gap, or difference, of $2$ between them.

The next four corners after that are $13,\ 17\ ,21\ and 25.$ with a difference
of $4.$
Actually, from $1\ to\ 3$ there is a difference of $2$ and from $9$ to $13$
there is a difference of $4.$

The question then becomes, is the difference between
corners going to grow by $2$ at each level?

It seems promising because we can also pretend that $1$ is its own
four corners, a difference of $0$ between them.

Let's see if this correctly predicts the next set of corners.

We should expect the next level of corners to come from a difference of $6$
and the level after that by $8$.

### Prediction

$$ Starts\ at\ 1 $$
$$ Corners\ by\ +2:\quad \quad 03\quad 05\quad 07\quad 09 $$
$$ Corners\ by\ +4:\quad \quad 13\quad 17\quad 21\quad 25 $$
$$ Prediction: $$
$$ Corners\ by\ +6:\quad \quad 31\quad 37\quad 43\quad 49 $$
$$ Corners\ by\ +8:\quad \quad 57\quad 65\quad 73\quad 81 $$

It's promising that all the final numbers are square numbers.
It seems like a pattern that would fall out of a thing like this.

### Sketchy prediction

Let's sketch this out on paper.
Do the predicted numbers fall on the diagonals?

<div style="text-align: center">
  <img alt="Grid paper with an extended number spiral" src="/images/euler-28-spiral.png">
</div>

Yes! We do indeed get $31,\ 37,\ 43,\ 49,\ 57,\ 65,\ 73,\ and\ 81$ next.
*I'll forgive you if you can't make that out from my awful handwriting.*

Now, interestingly, a difference of $8$ is between the corners of the
$9\times 9$ spiral. A difference of $6$ between the corners of the $7\times 7$ spiral.

This tells us that we need to consider differences up to $1000$, for the corners of the
$1001\times 1001$ spiral; the problem's target.

## Towards a solution

It would make sense to create an array of differences that looks
like this:

```uiua
    [1 2 2 2 2 4 4 4 4 6 6 6 6 8 8 8 8 ...]
```

We'd only have to `scan add` it, to generate the corners and then finally
`reduce add` it to get the sum.

```uiua
# Wowee, the corners
    \+ [1 2 2 2 2 4 4 4 4 6 6 6 6 8 8 8 8]
[1 3 5 7 9 13 17 21 25 31 37 43 49 57 65 73 81]

# Their sums
    /+ \+ [1 2 2 2 2 4 4 4 4 6 6 6 6 8 8 8 8]
537
```

### The keep trick

The repeats of $4$ differences is easy to do once you know this
one trick that doctors hate.

```uiua
    ▽ 1 1_2_3
[1 2 3]
    ▽ 2 1_2_3
[1 1 2 2 3 3]
    ▽ 3 1_2_3
[1 1 1 2 2 2 3 3 3]
```

That's right. You can repeat every single element of an array, by a set amount,
using `keep repeat_amount array`. In the words of the docs itself:

> ▽ keep with a scalar for the first argument repeats each row of the second
> argument that many times.
>
> [Keep Docs](https://www.uiua.org/docs/keep)

#### Getting the differences themselves

There are various ways to get a range `[2 4 6 8 ... 998 1000]`.

If you look at the [ranges tutorial](https://www.uiua.org/tutorial/ranges)
you might come away with this.

```uiua
    ⍜÷⇡₁2 1000
[2 4 6 8 ... 998 1000]
```

You might also use `mod 2` in combination with `not`.

```uiua
    ▽¬⊸◿2⇡₂1000
[2 4 6 8 ... 998 1000]
```

Or simply multiply a range of $1-500$ by $2.$

```uiua
    ×₂⇡₁500
[2 4 6 8 ... 998 1000]
```

I'll go with that one.

## Solution

We start with our range of singular differences.

```uiua
    ×₂ ⇡₁500
[2 4 6 8 ... 998 1000]
```

We `keep` four instances of each difference.

```uiua
    ▽4 ×₂ ⇡₁500
[2 2 2 2 4 4 4 4 ... 1000 1000 1000 1000]
```

Since our initial corner is $1$, we need to join it to the array.

```uiua
    ⊂1 ▽4 ×₂ ⇡₁500
[1 2 2 2 2 4 4 4 4 ... 1000 1000 1000 1000]
```

Now, to `scan add` for the corners.

```uiua
    \+ ⊂1 ▽4 ×₂ ⇡₁500
[1 3 5 7 9 13 17 21 25 31 ... 1000001 1001001 1002001]
```

Finally, we `reduce add` for the sum.

```uiua
    /+ \+ ⊂1 ▽4 ×₂ ⇡₁500
669171001
```

### Fast?

Ye.

```uiua
    ⊙◌⍜now(/+ \+ ⊂1 ▽4 ×₂ ⇡₁500)
0.00009202957153320313
```
