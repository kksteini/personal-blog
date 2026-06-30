+++
title = "11 - Largest Product in a Grid"
date = 2026-06-14
weight = 11
[extra]
doclink = "https://projecteuler.net/problem=11"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "prime-numbers"]
+++

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD013 -->

## Problem

In the $20 \times 20$ grid below, four numbers along a diagonal line have been
marked in pink.

<pre>
08 02 22 97 38 15 00 40 00 75 04 05 07 78 52 12 50 77 91 08
49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48 04 56 62 00
81 49 31 73 55 79 14 29 93 71 40 67 53 88 30 03 49 13 36 65
52 70 95 23 04 60 11 42 69 24 68 56 01 32 56 71 37 02 36 91
22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80
24 47 32 60 99 03 45 02 44 75 33 53 78 36 84 20 35 17 12 50
32 98 81 28 64 23 67 10 <span style="color:#ff2e88;"><b>26</b></span> 38 40 67 59 54 70 66 18 38 64 70
67 26 20 68 02 62 12 20 95 <span style="color:#ff2e88;"><b>63</b></span> 94 39 63 08 40 91 66 49 94 21
24 55 58 05 66 73 99 26 97 17 <span style="color:#ff2e88;"><b>78</b></span> 78 96 83 14 88 34 89 63 72
21 36 23 09 75 00 76 44 20 45 35 <span style="color:#ff2e88;"><b>14</b></span> 00 61 33 97 34 31 33 95
78 17 53 28 22 75 31 67 15 94 03 80 04 62 16 14 09 53 56 92
16 39 05 42 96 35 31 47 55 58 88 24 00 17 54 24 36 29 85 57
86 56 00 48 35 71 89 07 05 44 44 37 44 60 21 58 51 54 17 58
19 80 81 68 05 94 47 69 28 73 92 13 86 52 17 77 04 89 55 40
04 52 08 83 97 35 99 16 07 97 57 32 16 26 26 79 33 27 98 66
88 36 68 87 57 62 20 72 03 46 33 67 46 55 12 32 63 93 53 69
04 42 16 73 38 25 39 11 24 94 72 18 08 46 29 32 40 62 76 36
20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74 04 36 16
20 73 35 29 78 31 90 01 74 31 49 71 48 86 81 16 23 57 05 54
01 70 54 71 83 51 54 69 16 92 33 48 61 43 52 01 89 19 67 48
</pre>

The product of these numbers is $26 \times 63 \times 78 \times 14 = 1788696$.

What is the greatest product of four adjacent numbers in the same
direction (up, down, left, right, or diagonally) in the $20 \times 20$ grid?

## Foundations

### Rotations

We can rotate arrays in Uiua.
Let's see what that's about with `range`.

```uiua
    range 9
    ⇡ 9
[0 1 2 3 4 5 6 7 8]

```

Rotate pushes the elements to the left, and they wrap around.

```uiua

    rot 2 range 9
    ↻ 2 ⇡ 9
[2 3 4 5 6 7 8 0 1]

```

Negative goes the other direction.

```uiua
    rot `2 range 9
    ↻ ¯2 ⇡ 9
[7 8 0 1 2 3 4 5 6]
```

---
Rotate also works on higher dimensional arrays.
To rotate a 2D-array, for example, we need
2D coordinates.

```uiua
    M ← [0_0_0 0_1_0 0_0_0]
    M
╭─
╷ 0 0 0
  0 1 0
  0 0 0
        ╯
```

We can rotate left, right, up and down.

```uiua
    ≡↻ [0_1 0_¯1 1_0 ¯1_0] ¤M
╭─
╷ 0 0 0  0 0 0  0 1 0  0 0 0
╷ 1 0 0  0 0 1  0 0 0  0 0 0
╷ 0 0 0  0 0 0  0 0 0  0 1 0
                             ╯
```

And diagonally.

```uiua
    ≡↻ [1_1 1_¯1 ¯1_¯1 ¯1_1] ¤M
╭─
╷ 1 0 0  0 0 1  0 0 0  0 0 0
╷ 0 0 0  0 0 0  0 0 0  0 0 0
╷ 0 0 0  0 0 0  0 0 1  1 0 0
                             ╯
```

#### Uiua constants

Have a look at the [spatial constants](https://www.uiua.org/docs/constants).
What we just did for rotations is already
available from constants $A_2$ and $C_2$.

```uiua
# Trans to conserve space
    ⍉ ⊂ A₂ C₂
╭─
╷ 0 1  0 ¯1 1  1 ¯1 ¯1
  1 0 ¯1  0 1 ¯1 ¯1  1
                       ╯
```

We can therefore move around cardinally and diagonally with these two together.

```uiua
    rows,> rot join A,2 C,2 M
    ≡⌟↻ ⊂ A₂ C₂ M
╭─
╷ 0 0 0  0 1 0  0 0 0  0 0 0  1 0 0  0 0 1  0 0 0  0 0 0
╷ 1 0 0  0 0 0  0 0 1  0 0 0  0 0 0  0 0 0  0 0 0  0 0 0
╷ 0 0 0  0 0 0  0 0 0  0 1 0  0 0 0  0 0 0  0 0 1  1 0 0
                                                         ╯
```

## Towards a solution

We looked at 2D rotations in the foundations. It may not be obvious at first
why that relates to our problem and that's OK. Let's go through it step by step.

### Rotations as accumulators

Imagine that we have the 2D array, M, and our goal is to
find the biggest product of any three numbers down in a row.

```uiua
    M ← ↯ 4_4 ⇡ 16
    M
╭─
╷  0  1  2  3
   4  5  6  7
   8  9 10 11
  12 13 14 15
              ╯
```

It's easy to see here that the biggest product of three numbers, down in a row,
is $7 \times 11 \times 15 = 1155.$
How do we arrive at that with Uiua?

Well, let's try rotating our 2D array by multiples of 0, 1, and 2 in the downwards
direction, the vector $[-1\ 0]$. We don't want to allow wrapping so
let's also rotate with `fill 0`.

```uiua
    ≡⌟⬚0↻ [0_0 ¯1_0 ¯2_0] M
╭─
╷  0  1  2  3  0 0  0  0  0 0 0 0
╷  4  5  6  7  0 1  2  3  0 0 0 0
   8  9 10 11  4 5  6  7  0 1 2 3
  12 13 14 15  8 9 10 11  4 5 6 7
                                  ╯
```

Take a look at the bottom right coordinate (value 15 in the unchanged array).
For each rotation, reading them from left to right, this coordinate sees
the elements 15, 11 and 7.
Technically, this is then three numbers, up in a row, but since the order of
multiplications doesn't matter it is what we want.

Let's look at all multiplications at once.
We `reduce mul`

```uiua
    /× ≡⌟⬚0↻ [0_0 ¯1_0 ¯2_0] M
╭─
╷   0   0   0    0
    0   0   0    0
    0  45 120  231
  384 585 840 1155
                   ╯
```

Only two rows are populated with any numbers, other than $0.$
This makes sense because our zero fill value nulls wrapping products.
We are looking at three numbers in a row. For any column
we either start at the first or second element, to end at the third or fourth.
The other two wrapping choices multiply to zero.

Let's redefine $M$ as a 2D array made from a randomized range 1-16.

```uiua
    M = reshape 4_4 unsort range,1 16
    M ← ↯ 4_4 °⍆ ⇡₁16
    M
╭─
╷  5 10  8  3
  13 14  6  9
  15 11  1  4
   7  2 12 16
              ╯
```

Can you now guess the largest product going down?
Probably $10 \times 14 \times 11$, but let's confirm.
We apply the multiplication reduction
again.

```uiua
    /×≡⌟⬚0↻ [0_0 ¯1_0 ¯2_0] M
╭─
╷    0    0  0   0
     0    0  0   0
   975 1540 48 108
  1365  308 72 576
                   ╯
```

Yup. There it is, $10 \times 14 \times 11 = 1540.$

#### Product size n

Instead of writing our vectors manually, we can multiply the base vector over
a range.

```uiua
    V ← ¯1_0

    mul fix V range 3
    × ¤ V⇡ 3
╭─
╷ ¯0 0
  ¯1 0
  ¯2 0
       ╯
```

and therefore

```uiua
    /× ≡⌟⬚0 ↻ × ¤¯1_0 ⇡3 M
╭─
╷    0    0  0   0
     0    0  0   0
   975 1540 48 108
  1365  308 72 576
                   ╯
```

#### Multiple vectors

If we want to find the largest product from left to right and top to bottom at
the same time, we can simply change `V` to be a list of vectors.

```uiua
    V = [`1_0 0_`1]
    × ¤V ⇡3
╭─
╷ ¯0  0  ¯1  0  ¯2  0
╷  0 ¯0   0 ¯1   0 ¯2
                      ╯

```

Applying the same reduction process yields a list of 2D product arrays.

```uiua
    /× ≡⌟⬚0 ↻ × ¤V ⇡3 M
╭─
╷    0    0  0   0  0 0  400 240
╷    0    0  0   0  0 0 1092 756
   975 1540 48 108  0 0  165  44
  1365  308 72 576  0 0  168 384
                                 ╯
```

If this representation is confusing, try getting the last one.
That will be the products going left to right.

```uiua
    ⊣ /× ≡⌟⬚0 ↻ × ¤V ⇡3 M
╭─
╷ 0 0  400 240
  0 0 1092 756
  0 0  165  44
  0 0  168 384
               ╯
```

---

Now, we can extend this to all directions with `join A,2 C,2`.

```uiua
    /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
╭─
╷  400 240 0 0   975 1540 48 108  0 0  400 240     0    0  0   0    70 240 0 0  0 0 1680 198  0 0    0   0     0   0 0 0
╷ 1092 756 0 0  1365  308 72 576  0 0 1092 756     0    0  0   0  1716 224 0 0  0 0  462  18  0 0    0   0     0   0 0 0
   165  44 0 0     0    0  0   0  0 0  165  44   975 1540 48 108     0   0 0 0  0 0    0   0  0 0   70 240  1680 198 0 0
   168 384 0 0     0    0  0   0  0 0  168 384  1365  308 72 576     0   0 0 0  0 0    0   0  0 0 1716 224   462  18 0 0
                                                                                                                         ╯
```

Wowee, that's a lot of horizontal scrolling. The largest product,
of three numbers in a row in any direction, seems to be $1716.$
Let's look at the product array for the vector down and to the right.

```uiua
    ⊡6 /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
╭─
╷ 0 0    0   0
  0 0    0   0
  0 0   70 240
  0 0 1716 224
               ╯
```

Given the position we know that it is the product $13 \times 11 \times 12.$

#### Getting the largest value

What is the shape of our vector reduced products?

```uiua
    shape /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
    △ /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
[8 4 4]

```

Alright. $8 \times 4 \times 4.$
We can just reduce max three times.

```uiua
    /max /max /max /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
    /↥ /↥ /↥ /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
1716
```

Though, I suppose it is cleaner to just `deshape` it.

```uiua
    /↥ ♭ /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡3 M
1716
```

### Parsing

You can copy-paste the problem array into
[the Uiua pad](https://uiua.org/pad?src=0_19_0-dev_4__eJxVVLutJFUQ9V8Ux8BYvPp_PBLYKAgBaUNAQjg4OHj4GMRAKC8SdOot08uoNXP7zu1TVefTAPAZ7z__hk9vuM93kIEYzLANH2hCBCH87oQEJCGNHqRBDSnoxipkXhixvHb5nDZGoYNslGCaOyHYQThqEUPULJRB5IUxSgxXtCMTvdCALdbRSoBqpGMGLhDnYXV4ofKFkYYWbMKcNUqgijBWtUANq4rCjYtWeHN2L6y-MMzYhN7_qaxajlmEYu9sBs_EkWSDKrizlXlmsUA0y5SQFXabrBRBTt05SA_BJmACT5J05L4w3EjZ6NUITlQNFVhRpq98LLtpYRM63C_evjCqedyEo4uRcDXebnKoDfhyIYe3ShjqGLBv-AjKkUMfVFGdXaLuCdvDawvj1IvqBNkqR9uDoZyVouyZStBFMkxIDKcPbpaSG_owqAHXj7Y9rJdOPsyOx1NHkw0L-T_NjdoRb3k4C_v0ocWJJemJLRZ2pVIfA85wWDkLU-S4pheTyH58WucioY896ZJZBoSowcub3yWcOoceyjjIJy-67Hb0dLn-o8-kc_za2akucM20yXGaiXi0ZYaM0s0HZUldtNjKNsPnxwT1L6bJHda0VNUzy3mwhillXM8cbWfYs3U1F5n0De3sjGMyxt_2EVepnQa0JMWqpG-DYDpnsCKVfsEpo_7-9EGHLlsJ5RMu9MqHl8o4Vy3Gvjp-Eh0s6wX9HwY7SJZhthQrDHufl2LvLTKkla-nc2OeahnPLMowMVJKWj-kq6OV2XcClPI9RupPed0j6T9t33_58_3X3__5-_2vP37Ajz99ue3v3-7n89u_tDH3Pw==)
and create a multiline string with ctrl+4.

Then we can do some reverse `csv`-ing and parsing each number
to get the 2D array.

> See docs for [csv](https://www.uiua.org/docs/csv)
> *The delimiter and un sections especially*

We can then store this in a variable, M

```uiua
    M ← (
      $ 08 02 22 97 38 15 00 40 00 75 04 05 07 78 52 12 50 77 91 08
      $ 49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48 04 56 62 00
      $ 81 49 31 73 55 79 14 29 93 71 40 67 53 88 30 03 49 13 36 65
      $ 52 70 95 23 04 60 11 42 69 24 68 56 01 32 56 71 37 02 36 91
      $ 22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80
      $ 24 47 32 60 99 03 45 02 44 75 33 53 78 36 84 20 35 17 12 50
      $ 32 98 81 28 64 23 67 10 26 38 40 67 59 54 70 66 18 38 64 70
      $ 67 26 20 68 02 62 12 20 95 63 94 39 63 08 40 91 66 49 94 21
      $ 24 55 58 05 66 73 99 26 97 17 78 78 96 83 14 88 34 89 63 72
      $ 21 36 23 09 75 00 76 44 20 45 35 14 00 61 33 97 34 31 33 95
      $ 78 17 53 28 22 75 31 67 15 94 03 80 04 62 16 14 09 53 56 92
      $ 16 39 05 42 96 35 31 47 55 58 88 24 00 17 54 24 36 29 85 57
      $ 86 56 00 48 35 71 89 07 05 44 44 37 44 60 21 58 51 54 17 58
      $ 19 80 81 68 05 94 47 69 28 73 92 13 86 52 17 77 04 89 55 40
      $ 04 52 08 83 97 35 99 16 07 97 57 32 16 26 26 79 33 27 98 66
      $ 88 36 68 87 57 62 20 72 03 46 33 67 46 55 12 32 63 93 53 69
      $ 04 42 16 73 38 25 39 11 24 94 72 18 08 46 29 32 40 62 76 36
      $ 20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74 04 36 16
      $ 20 73 35 29 78 31 90 01 74 31 49 71 48 86 81 16 23 57 05 54
      $ 01 70 54 71 83 51 54 69 16 92 33 48 61 43 52 01 89 19 67 48
      ≡⋕°⬚@ csv
    )

    M
╭─
╷  8  2 22 97 38 15  0 40  0 75  4  5  7 78 52 12 50 77 91  8
  49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48  4 56 62  0
  81 49 31 73 55 79 14 29 93 71 40 67 53 88 30  3 49 13 36 65
  52 70 95 23  4 60 11 42 69 24 68 56  1 32 56 71 37  2 36 91
  22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80
  24 47 32 60 99  3 45  2 44 75 33 53 78 36 84 20 35 17 12 50
  32 98 81 28 64 23 67 10 26 38 40 67 59 54 70 66 18 38 64 70
  67 26 20 68  2 62 12 20 95 63 94 39 63  8 40 91 66 49 94 21
  24 55 58  5 66 73 99 26 97 17 78 78 96 83 14 88 34 89 63 72
  21 36 23  9 75  0 76 44 20 45 35 14  0 61 33 97 34 31 33 95
  78 17 53 28 22 75 31 67 15 94  3 80  4 62 16 14  9 53 56 92
  16 39  5 42 96 35 31 47 55 58 88 24  0 17 54 24 36 29 85 57
  86 56  0 48 35 71 89  7  5 44 44 37 44 60 21 58 51 54 17 58
  19 80 81 68  5 94 47 69 28 73 92 13 86 52 17 77  4 89 55 40
   4 52  8 83 97 35 99 16  7 97 57 32 16 26 26 79 33 27 98 66
  88 36 68 87 57 62 20 72  3 46 33 67 46 55 12 32 63 93 53 69
   4 42 16 73 38 25 39 11 24 94 72 18  8 46 29 32 40 62 76 36
  20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74  4 36 16
  20 73 35 29 78 31 90  1 74 31 49 71 48 86 81 16 23 57  5 54
   1 70 54 71 83 51 54 69 16 92 33 48 61 43 52  1 89 19 67 48
                                                              ╯
```

## Solution

Let's put it all together.
Using the full 2D array `M` and updating the range to $4$, we get

```uiua
    /↥ ♭ /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡4 M
70600674
```

### How fast?

Quite fast.

```uiua
    ⊙◌⍜now(/↥ ♭ /× ≡⌟⬚0 ↻ × ¤(⊂ A₂C₂) ⇡4 M)
0.00032210350036621094
```

Though, each direction is counted twice. You can pick left-right, up-down and
both diagonals with only four vectors, for example.

```uiua
    /↥ ♭ /× ≡⌟⬚0 ↻ × ¤[1_0 0_1 1_1 1_¯1] ⇡4 M
70600674
    ⊙◌⍜now(/↥ ♭ /× ≡⌟⬚0 ↻ × ¤[1_0 0_1 1_1 1_¯1] ⇡4 M)
0.0002319812774658203
```
