+++
title = "15 - Lattice Paths"
date = 2026-07-01
weight = 15
[extra]
doclink = "https://projecteuler.net/problem=15"
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxtkLGOE0EQRPP5ipI2AASLfSdHiIQEEwC6jHg82_YMzM4s3b0YEy6CwAKJjOQSgtN9AkiEF95fzJegsREnBEknVd31uho8Hlk9MTpSG6JAiB6YBjaNq_tBZmMYbSu5p5bGSNwOnFeRepmdLNqY04ZEW5djtPquFXo9UnI0Mw2WpEj0VhFDIuQ1zqw4G28JlINNm0hm-fwpyscvuIuyf1_2E67P65wb0-AsuFfoQ9dFAkXqKSnWnHvYBMtsd6Y6nh0N9UjZf0P5tMfV9zJNKPsf5fKn-c2hnuAyM8mQUxfS5j8wzU1MZgQVRKsaHGGw6s2SdMmhe2F3coi7Sb8-L58v6isnuPpapqmGPkqyJUaQGs20zkx_XTg9_Pgkb-kN8b1_aeDtYRUD54FYd1Bv1TTYkGrlr9rpXP0f6NvHru4cS6ryosq1fNNUkJejKBZzOJ-z1GVsfXAeziasCNa53A8xiKfONNgG9dBxiCSmXH54WP2LufkF9gjKzQ=="
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "pascal"]
+++

## Problem

Starting in the top left corner of a $2 \times 2$ grid, and only being able
to move to the right and down, there are exactly $6$ routes to the bottom right
corner.

<img alt="The 6 paths" src="/images/euler-15-intro.png" style="max-width: 100%; height: auto; display: block; margin: auto;"/>

How many such routes are there through a $20 \times 20$ grid?

## Tracing the paths

Let's represent the paths as a set of nodes. Since this is a $2 \times 2$ grid
we need $3 \times 3$ nodes to pass through.
We'll mark the first node, top left, with $1.$

We'll trace the paths in iterations.
Each node can either split into two paths, or go along an edge.

If a node has all previous paths connected, we'll add the values of those paths
together and set the node value to that.

See the following image for the iterative steps for a $2 \times 2$ grid.

<img alt="The 6 paths" src="/images/euler-path-to-pascal.png" style="max-width: 100%; height: auto; display: block; margin: auto;"/>

### Enter Pascal

Those numbers are peculiar. I noted that the first few iterations produced
an increasing amount of elements. $1$, $1\ \ 1$, $1\ \ 2\ \ 1.$
I [searched the OEIS](https://oeis.org/search?q=1%2C1%2C1%2C1%2C2%2C1&language=english&go=Search).
The first result, A001221, didn't seem relevant but Pascal's triangle, A007318,
had some relevant numbers; the double threes were there and a six was not
too far behind. I supposed that we'd see these *missing* numbers if we
made larger grids.

---

To make Pascal's triangle, we start with $1$ as the top node.
For each new line, copy all elements from above, diagonally
to the left and right.
If an element is already present in the new line, don't overwrite,
but add to its value instead.

If you do this, you should get something like this.

```plain
A:     1
B:    1 1
C:   1 2 1
D:  1 3 3 1
E: 1 4 6 4 1
```

>I've enumerated the lines of the triangle from A-E so that
>we can talk about them going forward.

---

The $1 \times 1$ grid is contained within the $2 \times 2$ grid.
We see that this grid has $2$ ways to be traversed.
In the same way, we can extend the $2 \times 2$ grid by
adding dots below, to the right and extending diagonally
on the last one.

<img alt="Figure showing matrix grid extension" src="/images/euler-15-grid-extension.png" style="max-width: 100%; height: auto; display: block; margin: auto;"/>

Cool. A $3 \times 3$ grid has $20$ ways to be traversed.
If you think back on Pascal's triangle, the numbers we are deriving for grid
traversal are appearing every other line.

>I think we can argue that you can do one thing and one thing only for a
>$0 \times 0$ grid, namely *nothing.*

$$0 \times 0 = \ middle\ element\ of\ A$$
$$1 \times 1 = \ middle\ element\ of\ C$$
$$2 \times 2 = \ middle\ element\ of\ E$$

Our prediction now is that the middle element of line $G$ is $20.$
We extend according to the rules downward from E.

```plain
E:   1    4    6    4    1
F:  1   5   10   10   5   1
G: 1  6   15   20  15   6  1
```

Yes, the middle element of line $G$ is indeed $20.$

## Solution

### Generating Pascal's triangle in Uiua

This should be relatively straightforward.
When presented with a list of elements, in some line of Pascal's triangle,
we want to copy them down, to the left and to the right, but add to them
if an element is already there.

Let's use `[1 2 1]` as an example.
We know that the new line will have four elements.
This means that:

* -the left copy will be `[1 2 1 0]`
* -the right copy will be `[0 1 2 1]`

Adding them together results in `[1 3 3 1]`, so our reasoning is likely correct.
Let's write a function for getting the next line, `GNL`, and see if it produces
the correct results.

Since copying down, in both directions, is the same as pre- and appending a $0$,
we might fork a `join 0` and a `backward join 0` to the input.

```uiua
    fork(join0|bwjoin0) [1 2 1]
    ⊃(⊂0|˜⊂0) [1 2 1]
[1 2 1 0]
[0 1 2 1]
```

That's what we want to add together alright.
Since $0$ is the same argument to both fork functions we can
factor it out like so.

```uiua
    fork join bwjoin 0 [1 2 1]
    ⊃⊂ ˜⊂ 0 [1 2 1]
[1 2 1 0]
[0 1 2 1]
```

Now we just need to add them together and we have our `GNL` function.

```uiua
    GNL ← + ⊃⊂ ˜⊂ 0
    GNL [1 2 1]
[1 3 3 1]
```

Does it produce the same results for A-G as we've calculated by hand?
Let's run it for 0-7 iterations and see what it produces.

> `&s` prints to stdout
>
> `repeat` needs `bw` because the range is to be supplied as the repeat amount
> whereas `1` is the initial input to `GNL`

```uiua
    ≡(&s ˜⍥GNL 1) ⇡₁6
[1 1]
[1 2 1]
[1 3 3 1]
[1 4 6 4 1]
[1 5 10 10 5 1]
[1 6 15 20 15 6 1]
```

### The 40th line

Looking at the triangle, we see the following pattern.

$$0 \times 0 = \ middle\ element\ of\ line\ 0$$
$$1 \times 1 = \ middle\ element\ of\ line\ 2$$
$$2 \times 2 = \ middle\ element\ of\ line\ 4$$
$$3 \times 3 = \ middle\ element\ of\ line\ 6$$

We can get the middle element of an array by picking the element that's halfway
across its length. It might be something like `pick floor div,2 by len SOME_ARRAY`.

```uiua
    PickMiddle = pick floor div,2 by len
    PickMiddle ← ⊡ ⌊ ÷₂ ⊸⧻

    GetGridWays = PickMiddle bw repeat GNL 1 mul,2
    GetGridWays ← PickMiddle˜⍥GNL 1 ×₂
```

Let's test a couple of the known values.

```uiua
    GetGridWays 1
2
    GetGridWays 2
6
    GetGridWays 3
20
```

That seems right. Let's go for it.

```uiua
    GetGridWays 20
137846528820
```

### How fast?

Very fast. Roughly 100 microseconds.

```uiua
    ⊙◌⍜now(GetGridWays 20)
0.00009560585021972656
```

## A shorter solution?

Look at [Pascal's triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle)
on Wikipedia.

Here's a very interesting passage from that article.

>In the $n$th row of Pascal's triangle, the $k$th entry is denoted $\binom{n}{k}$,
> pronounced "n choose k" because it describes the number of combinations:
> the number of ways of choosing $k$ things from among a collection of $n$ things.

Our answer therefore is "40 choose 20" or $\binom{40}{20}.$
Since this represents combinations, your spidey senses might tingle for a certain
function.

[Tuples](https://www.uiua.org/docs/tuples)
has to do with permutations and combinations.
Try scanning it and see if you find something useful.

These stand out.

> `<` and `>` will give all unique *combinations* of rows from the array.

and

> If the second argument is a scalar, the number of tuples that would be
> returned for the `⇡ range` of that number is returned.

For tuples, given `<` or `>`, the first argument is how many elements we want
per arrangement and the second will be how many we can choose from.
Therefore the solution is simply:

```uiua
    # tuples < choose_this_many from_this_many
    tuples < 20 40
    ⧅< 20 40
137846528820
```

### Faster?

This one runs in ~5 microseconds or about 20 times faster.
Both solutions are well within the minute limit so this is just pedantry at this
point.
Of course, whenever you can use pure built-ins you should do so.
