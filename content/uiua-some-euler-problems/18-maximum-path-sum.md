+++
title = "18 - Maximum Path Sum"
date = 2026-07-07
weight = 18
[extra]
doclink = "https://projecteuler.net/problem=18"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxlUruOFDEQzP0VJe0FIDQ3tttPInRCSKQnyEi8d2ZnYF6anWHhBxaxEJCQoAtOSJchkSKR8SnzJchze9IAloN2ubq6uu0Vnoz9UMQel3EIZbV9yFYIzbg-Lbf5WI4h27Z1zOJYxT7r-nZdxXqbC5fV4W1Zj3XWhaHItmOdM3YedgCm_WecwGqG4zqB1zBqcRYWysLJJeRAGs5C8AUqObiCk4lulorCgwtIgtXgBFqqOwcuYS0sgVsYgrFLMx5GJ1npwA2EgeXwSy9KpC0NtIEjKA7HE4noH5KDlSBK7kiCbBLzCtIveJpgBZRKRaWGIngBLeEttIBYGrccQiQ96Y72hYV1IA_jUqz_6kMkYS1B851QCVEE7aA5pIX0UG6RkAZhUuPGwflkzFgQn-sYGJ-mrzhILHISW8K7WY_A_Twsl3I8pcqaYOZHksSeNt04zO8_ff_Kp8PVvelwNX38Mh1-Th-uH-H-MXjR4DzsGFvhrB0KhK7r23BRxC1elZtNFRFQlU2cP-IlhiI2eNn2iOGiQPsm9lXo2Crh7_A6xi5FqEK_iT2asV7H_pSdtcPQ1s-72c0DTPub2ROSg_0vCPas7R63u-b2u_5P-P1DMDYdvuV3QtP7T3N7LJ_2N_ld9i30B4781lA="

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

By starting at the top of the triangle below and moving to adjacent numbers on the row below, the maximum total from top to bottom is $23$.
<pre>
   <span style="color:#ff2e88;"><b>3</b></span>
  <span style="color:#ff2e88;"><b>7</b></span> 4
 2 <span style="color:#ff2e88;"><b>4</b></span> 6
8 5 <span style="color:#ff2e88;"><b>9</b></span> 3
</pre>

That is, $3 + 7 + 4 + 9 = 23$.
Find the maximum total from top to bottom of the triangle below:
<pre>
75
95 64
17 47 82
18 35 87 10
20 04 82 47 65
19 01 23 75 03 34
88 02 77 73 07 63 67
99 65 04 28 06 16 70 92
41 41 26 56 83 40 80 70 33
41 48 72 33 47 32 37 16 94 29
53 71 44 65 25 43 91 52 97 51 14
70 11 33 28 77 73 17 78 39 68 17 57
91 71 52 38 17 14 91 43 58 50 27 29 48
63 66 04 68 89 53 67 30 73 16 69 87 40 31
04 62 98 27 23 09 70 98 73 93 38 53 60 04 23
</pre>
**NOTE:** As there are only $16384$ routes, it is possible to solve this problem
by trying every route.
However, [Euler Project Problem 67](https://projecteuler.net/problem=18), is
the same challenge with a triangle containing one-hundred rows;
it cannot be solved by brute force, and requires a clever method! (c;

## Parsing

Let's start by copying the [example triangle into the Uiua pad.](https://uiua.org/pad?src=0_19_0-dev_4__JCAzCiQgNyA0CiQgMiA0IDYKJCA4IDUgOSAzCg==)

```uiua
$ 3
$ 7 4
$ 2 4 6
$ 8 5 9 3

Yields: "3\n7 4\n2 4 6\n8 5 9 3"
```

We see the `\n` characters in there, so let's start with our good
old friend, the `pbbn` alias.

```uiua
$ 3
$ 7 4
$ 2 4 6
$ 8 5 9 3
⊜□⊸≠@\n

Yields: ["3"│"7 4"│"2 4 6"│"8 5 9 3"]
```

There are four lines in this example that we'd like to split
and parse by space.
We can switch out the `partition` function with `ppbn@` to split
into numbers by space.

```uiua
$ 3
$ 7 4
$ 2 4 6
$ 8 5 9 3
⊜(⊜⋕⊸≠@ )⊸≠@\n

Error: Cannot combine arrays with shapes [1] and [4]
```

Of course. Let's set a fill context of $0$ for our outer partition.

```uiua
$ 3
$ 7 4
$ 2 4 6
$ 8 5 9 3
⬚0⊜(⊜⋕⊸≠@ )⊸≠@\n

Yields:
╭─
╷ 3 0 0 0
  7 4 0 0
  2 4 6 0
  8 5 9 3
          ╯
```

## Towards a solution

Let's store our example triangle in `Input` see what we can do.

```uiua
    RawInput ← $ 3
               $ 7 4
               $ 2 4 6
               $ 8 5 9 3
    Input ← ⬚0⊜(⊜⋕⊸≠@ ) ⊸≠ @\n RawInput

    Input
╭─
╷ 3 0 0 0
  7 4 0 0
  2 4 6 0
  8 5 9 3
          ╯
```

Since we have a slanted triangle here, choosing the left path is equivalent to
advancing down a row, while taking the right path is down and to the right.

In more specific terms:

* -If we're at the first row, we see $3.$
* * +We can go down a row to see $7.$
* * +We can go down a row and shift to the right to see $4.$

### Trickle trick

It would be nice if we could simply reduce this 2D-array such that a
maximal path is found in a single pass.

How can we encode or *calculate* the decision of taking the maximal path?
Well, from every node, we can either go down or to the right.
It would be nice if we had already
shifted the row below **left** by one, and taken the maximum between the results.
That way, any node only has a choice of the maximal value.

#### Step by step

*We have to shift to the left when going from the bottom up*.

Starting at the bottom we shift like so.

```plain
[8 5 9 3] #normal
[5 9 3 0] #shifted to the left 
--------
[8 9 9 3] #max value between both
```

Now it doesn't matter whether a node trickles down right,
the maximum number has already been chosen between the two.

If we look at the row above, then $2$ and $4$ would see

```plain
[2 4 6 0]
[8 9 9 3]
```

On adding, we get.

```plain
[10 13 15 3]
```

Taking the maximal step again.

```plain
[10 13 15 3]  # normal
[13 15 3 0] # shifted to the left
---
[13 15 15 3] # max value between both
```

Then the next row above gets added against it as:

```plain
[7  4  0  0]
[13 15 15 3]
---
[20 19 15 3]
```

Final shift step is.

```plain
[20 19 15 3]
[19 15 3  0]
---
[20 19 15 3]
```

Followed by the final addition step.

```uiua
[3  0  0  0]
[20 19 15 3]
---
[23 19 15 3]
```

We simply take the largest value produced, the first value, and
what we get is $23.$

#### Programming it in Uiua

The first step is to create the maximum between the row
and its rotation.
We'll start with:

```uiua
[8 5 9 3]
```

Let's rotate to the left and keep the original.

```uiua
    ⊸↻₁ [8 5 9 3]
[8 5 9 3]
[5 9 3 8]
```

Oh yeah, we'll want the rotation not to wrap, but to produce $0.$

```uiua
    ⬚0⊸↻₁ [8 5 9 3]
[8 5 9 3]
[5 9 3 0]
```

Now, we take the max between them.

```uiua
    ↥ ⬚0⊸↻₁ [8 5 9 3]
[8 9 9 3]
```

---

We want to run this code in a reduction context.
What would the arguments look like?
Let's `reverse` our Input and debug the reduction.

```uiua
    /(+?) ⇌Input
┌╴? 1:4
│╴╴╴╶╶╶
├╴[2 4 6 0]
├╴[8 5 9 3]
└╴╴╴╴╴╴
┌╴? 1:4
...<truncated>...
```

Supplying our max-by-rotation method to reduce would result in:

```uiua
    ↥ ⬚0⊸↻₁ [8 5 9 3] [2 4 6 0]
[2 4 6 0]
[8 9 9 3]
```

We are just missing the addition step from before.
Our reduction function is therefore:

```uiua
    F ← + ↥ ⬚0 ⊸↻ 1
```

Now we can reduce with our function.
*Remember, our reduction function assumes
that our input is reversed.*

```uiua
    /F ⇌ Input
[23 19 15 3]
```

Nice. $23$ is the first element.

---

Hang on. Can't we make a complementary function, `G`, which
behaves like `F` except it rotates the other way?
That would allow us to traverse the input
going down.

```uiua
    G ← + ↥ ⬚0 ⊸↻ ¯1

    /G Input
[20 19 23 16]
```

Yeah! $23$ is in there too!

## Solution

Let's parse the whole thing.

```uiua

    Raw ← $ 75
          $ 95 64
          $ 17 47 82
          $ 18 35 87 10
          $ 20 04 82 47 65
          $ 19 01 23 75 03 34
          $ 88 02 77 73 07 63 67
          $ 99 65 04 28 06 16 70 92
          $ 41 41 26 56 83 40 80 70 33
          $ 41 48 72 33 47 32 37 16 94 29
          $ 53 71 44 65 25 43 91 52 97 51 14
          $ 70 11 33 28 77 73 17 78 39 68 17 57
          $ 91 71 52 38 17 14 91 43 58 50 27 29 48
          $ 63 66 04 68 89 53 67 30 73 16 69 87 40 31
          $ 04 62 98 27 23 09 70 98 73 93 38 53 60 04 23
    Input ← ⬚0⊜(⊜⋕⊸≠@ )⊸≠@\n Raw
```

Now we can use either `F` or `G` to acquire the largest path.

```uiua
    ⊢ /F⇌Input
1074

    /↥ /G Input
1074
```

### Fast?

Both ways operate in about 40 microseconds.

```uiua
    ⊙◌⍜now(/↥ /G Input)
0.0000438690185546875

    ⊙◌⍜now(⊢ /F⇌Input)
0.000044345855712890625
```
