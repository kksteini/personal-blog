+++
title = "Thinking With Arrays"
date = 2026-04-29
weight = 12

[extra]
doclink = "https://www.uiua.org/tutorial/Thinking With Arrays"
toc = true

[taxonomies]
categories = ["uiua-challenges"]
tags = ["uiua"]
+++

## Challenge 1

**Write a program that negates each number in a list that is not a multiple of 3.**

### C1 Solution

```uiua
⍜▽¯ ≠0⊸◿3
```

**Why?**

Let's start with the range 1-9.
We expect to get at an outcome where all numbers are negative
except 3, 6 and 9, that is `[-1,-2,3,-4,-5,6,-7,-8,9]`.

Let's define that range.

```uiua
    X ← ⇡₁9
[1 2 3 4 5 6 7 8 9]
```

We can calculate `mod 3` on that range and keep it with `by`.

```uiua
    ⊸◿3 X
[1 2 3 4 5 6 7 8 9]
[1 2 0 1 2 0 1 2 0]
```

All multiples of 3 have 0 for `mod 3`.
Therefore, we want to target `not equals` on `mod 3`.

```uiua
    ≠0 ⊸◿3 X
[1 2 3 4 5 6 7 8 9]
[1 1 0 1 1 0 1 1 0]
```

Just as a sanity check, what does it look like if we `keep` them?

```uiua
    ▽ ≠0 ⊸◿3 X
[1 2 4 5 7 8]
```

Yes, it looks like `keep` is the candidate for the transformation to `under`,
and the function to be simply `neg` to negate them.
Let's try it.

```uiua
    ⍜▽¯ ≠0 ⊸◿3 X
[¯1 ¯2 3 ¯4 ¯5 6 ¯7 ¯8 9]
```

Great! Whatever `keep` kept got negated and then `under` reversed that transformation.

## Challenge 2

**Write a program that returns the last word of a string.**

### C2 Solution

***Note:** I will denote the space character with the ░ character. If you copy
my solution make sure to replace it with space.*

My solution

```uiua
°□ ⊣ ⊜□⊸≠@░
```

vs intended

```uiua
▽ ⍜⇌\× ⊸≠@░
```

**Why?**

I will store `"This is a test"` in the variable `X` for this.
Notice that both solutions use `by neq @░`.
What does that look like? What does it do?

```uiua
    ⊸≠@░X
"This is a test"
[1 1 1 1 0 1 1 0 1 0 1 1 1 1]
```

We get an array where zeroes correspond to where there are spaces in the
input string. `by` simply keeps the string around. Whenever we have these
arrays of 1s and 0s, resulting from some conditional work, it is
customary to call them *masking arrays*.

```plain
Spaces are zero
    |  | |
    v  v v
This is a test   <---String
11110110101111   <---Masking array
```

Let's examine both solutions with this as a starting point.

**Why? My solution.**

The tutorial has the following statement about `partition`
>⊜ partition is a powerful modifier that splits up an
>array based on a list of consecutive keys.

That seems quite handy, doesn't it?
There are consecutive 1s where there are words and consecutive 0s where there
are spaces. So let's try `partition id` with the masking array.

```uiua
    ⊜∘⊸≠@░X
Error: Cannot join arrays of shapes [1 × 4] and [2]
```

Oh, right. You can't make arrays of strings like `"Wowee"_"Varying"_"Lengths"`.
You have to box them.
Let's replace `par id` with `par box`.

```uiua
    ⊜□⊸≠@░X
["This"│"is"│"a"│"test"]
```

>Fun fact, this is a common enough pattern that you can just write `ppbn`. See [aliases](https://www.uiua.org/docs/idioms#aliases)

Anyway, at this point it seems obvious to get the `last` element.

```uiua
    ⊣⊜□⊸≠@░X
□"test"
```

Almost there, we just need to `unbox` that thing.

```uiua
    °□⊣⊜□⊸≠@░X
"test"
```

**Why? Intended solution.**

As a reminder, this is what we start from.

```uiua
    ⊸≠@░X
"This is a test"
[1 1 1 1 0 1 1 0 1 0 1 1 1 1]
```

In the tutorial documentation, we are shown a way to get the first word
using `keep scan mul`. What `scan mul` will do is accumulate a multiplier
as it goes along an array. Since spaces are marked with zero, every subsequent
scan of the array after that will be 0.

```uiua
    \× ⊸≠@░X
"This is a test"
[1 1 1 1 0 0 0 0 0 0 0 0 0 0]
```

Checks out.

```plain
Everything 0 
after this point
    |
    |
    v
This is a test
11110000000000
```

Keeping this would result in `"This"`, surely.

```uiua
    ▽ \× ⊸≠@░X
"This"
```

But wouldn't it be good if we could instead make a mask for the last word?

```plain
# Something like this

This is a test
00000000001111
```

For that, we just have to reverse the masking array, `scan mul` it, and reverse
it back. At this point, alarm bells might go off in your head. Whenever you hear
*transform something, manipulate, reverse the transformation*, `under`
ought to come to mind. `under rev mul`. Let's tack that on.

```uiua
    ⍜⇌\× ⊸≠@░X
"This is a test"
[0 0 0 0 0 0 0 0 0 0 1 1 1 1]
```

Finally, we keep that thing.

```uiua
    ▽ ⍜⇌ \× ⊸≠@░X
"test"
```

## Challenge 3

**Write a program that for every multiple of 3 in a list, multiplies the
following number by 10.**

### C3 Solution

```uiua
⍜▽×₁₀ ⬚0↻¯1 =0⊸◿3
```

or

```uiua
⍜▽(×10) ⬚0↻¯1 =0⊸◿3
```

**Why?**

Let's start by looking at the range 1-7.
Targeting the multiples of 3,
what does `eq0 by mod 3` give us?

```uiua
    =0 ⊸◿3⇡₁7
[1 2 3 4 5 6 7]
[0 0 1 0 0 1 0]
```

Hmm, this as a targeting mask is one off.
Let's rotate it by one

```uiua
    ↻1 =0 ⊸◿3⇡₁7
[1 2 3 4 5 6 7]
[0 1 0 0 1 0 0]
```

Ah, wrong direction. So ``rot `1`` instead

```uiua
    ↻¯1 =0 ⊸◿3⇡₁7
[1 2 3 4 5 6 7]
[0 0 0 1 0 0 1]
```

OK, now we have our targeting mask. Let's select by those
targets, multiply by 10 and then give them back. That's a job for `under`.

```uiua
⍜▽×₁₀ ↻¯1 =0 ⊸◿3⇡₁7
[1 2 3 40 5 6 70]
```

It does the thing. But, when we submit it it fails on the `[3 3 3 3]` test.
What gives?

```uiua
    ⍜▽×₁₀ ↻¯1 =0 ⊸◿3 3_3_3_3
[30 30 30 30]
```

Ah, the first one shouldn't be 30. It should remain a 3, the wording stated
**the following number**.

What is happening then? Let's look at two cases for rotation

```uiua
    ↻¯1 [0 1 0]
[0 0 1]
    ↻¯1 [0 0 1]
[1 0 0]
```

It's simply wrapping. Look at the [rotate docs](https://www.uiua.org/docs/rotate).
>⬚ fill↻ rotate fills in array elements instead of wrapping them.

Let's try filling with 0 then

```uiua
    ⍜▽×₁₀ ⬚0↻¯1 =0 ⊸◿3 3_3_3_3
[3 30 30 30]
```

And there we have it.

## Challenge 4

**Write a program that given a matrix of 0s and 1s, only
keeps the 1s that have even x and y coordinates.**

### C4 Solution

My solution

```uiua
⍜⊡×₀▽⊸≡(>0/+◿2)⊸⊚
```

vs intended

```uiua
⍜⊚(▽≡/×¬⊸◿2)
```

**Why? My solution.**

*Here I show you my initial thought process and then walk
you through the more Uiua way to do it.
Feel free to skip ahead to the intended
solution of course.*

How do we get the indices **where** the elements equal `k`?
We use `where eq k`. Let's take the example array and
store in `m`.

```uiua
    m
╭─
╷ 1 1 0
  0 1 1
  0 1 1
        ╯
```

Let's see where the elements are
equal to 0.

```uiua
    ⊚=0 m
╭─
╷ 0 2
  1 0
  2 0
      ╯
```

Notice, the `eq` operator leaves behind `1`s where the
condition holds. So to get all the indices where elements
already equal to `1`, we can skip the `eq 1` conditional.

```uiua
    ⊚ m
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
```

So what can we do? It would be great if we could identify all indices where
the `x` and `y` coordinates are both even. Let's `by mod 2` on `where m`.

```uiua
    ⊸◿2 ⊚m
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
╭─
╷ 0 0
  0 1
  1 1
  1 0
  0 1
  0 0
      ╯
```

OK, the first and last index in the list of indices, `0 0` and `2 2` are
exclusively even numbered. They get marked as `0 0` on `mod 2`.

What if from that we add together every index row and check where the sum is above
0? Those should be instances with either odd `x` or `y` coordinates.
Let's do that and also keep around the original 2D matrix

```uiua
    ⊸≡(>0/+◿2) ⊸⊚ m
╭─
╷ 1 1 0
  0 1 1
  0 1 1
        ╯
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
[0 1 1 1 1 0]
```

Aha! The `[0 1 1 1 1 0]` array identifies the `x` or `y` odd indices.
Now we can apply `keep`.

```uiua
    ▽ ⊸≡(>0/+◿2) ⊸⊚ m
╭─
╷ 1 1 0
  0 1 1
  0 1 1
        ╯
╭─
╷ 0 1
  1 1
  1 2
  2 1
      ╯
```

Now, for each index we want to select (transform), multiply by 0 (mutate) and
finally roll back the transformation. Sounds like a job for `under`.
Let's `under sel mul,0` to zero out all the relevant indices.

```uiua
    ⍜⊏×₀▽⊸≡(>0/+◿2) ⊸⊚ m
Error: Cannot undo multi-dimensional selection
```

Whoops. `select` is not the way to get elements by indices.
What we want here is `pick`.
*I remember making this error a lot when starting out so I include this here.*
Let's try again but with pick this time:

```uiua
    ⍜⊡×₀▽⊸≡(>0/+◿2) ⊸⊚ m
╭─
╷ 1 0 0
  0 0 0
  0 0 1
        ╯
```

**Why? The intended solution**

After you play around with 2D matrices and `where` a bit, one thing
you might think to try is `un where`.

We will represent a certain test matrix with `m`.

```uiua
    m
╭─
╷ 1 1 0
  0 1 1
  0 1 1
        ╯
```

Since `where` gives you the indices of `1s` we can do `where m`.

```uiua
    ⊚ m
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
```

Now, what is interesting is that `un where` on a list
of indices will result in a matrix where the provided indices are 1s.

For example

```uiua
    °⊚ [0_0 1_1 2_2]
╭─
╷ 1 0 0
  0 1 0
  0 0 1
        ╯
```

This implies that we could use `where` as the transformation for `under`,
manipulate the indices and then "return" them to the matrix.

Though, what happens if we supply it coordinates that are not unambiguously
from a 3x3 matrix?

```uiua
    °⊚ [1_1]
╭─
╷ 0 0
  0 1
      ╯
```

OK, it makes sense that it only "expands" its area as far
as its furthest coordinates. Is this a problem for `under where` then?

Let's make 3x3 matrix of 1s, and then apply `under where` to it
such that we only keep the index `1_1`, like the  
`un where` example above.

```uiua
    n
╭─
╷ 1 1 1
  1 1 1
  1 1 1
        ╯

# ▽⊸≡(≍1_1):
# keep only 1_1
    ⍜(⊚|▽⊸≡(≍1_1)) n
╭─
╷ 0 0 0
  0 1 0
  0 0 0
        ╯
```

Well, it seems that `under` knows or keeps context about
the original 3x3 matrix. Going backwards out of the `under`,
`un where` doesn't emit a 2x2.

This means we are safe to use `unwhere` to manipulate the indices before they
get "put back".

Doesn't this imply that we can simplify my original solution?
Instead of targeting some-odd indices want to focus on keeping the
all-even so that they get "put back" as `1`s
during the reverse transformation in.

My reworked solution would just need to be passed to `under where` with the logic
checking for `eq 0` on `rows reduce add` instead of `gt 0`.

```uiua
    m
╭─
╷ 1 1 0
  0 1 1
  0 1 1
        ╯
    ⍜⊚(▽ =0 ≡/+ ⊸◿2) m
╭─
╷ 1 0 0
  0 0 0
  0 0 1
        ╯
```

Nice. Greatly improved. So what does the intended solution do different?
It uses `not`. Here, it will change `0`s to `1`s and vice versa.

```uiua
    ¬⊸◿2 ⊚ m
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
╭─
╷ 1 1
  1 0
  0 0
  0 1
  1 0
  1 1
      ╯
```

We can now see that `reduce mul` will zero out indices where the `mod 2` didn't
mark out both indices as `0`s.

```uiua
    ≡/× ¬⊸◿2 ⊚ m
╭─
╷ 0 0
  0 1
  1 1
  1 2
  2 1
  2 2
      ╯
[1 0 0 0 0 1]
```

Applying `keep` at this point would result in `[0_0 2_2]`, which is what we want
in the reverse transformation context of `under where` and therefore

```uiua
    ⍜⊚(▽ ≡/× ¬ ⊸◿2) m
╭─
╷ 1 0 0
  0 0 0
  0 0 1
        ╯
```

**Rest of chapter in progress.**

## Exercises

### Exercise 1

I think it's neat to generate
the [triangle numbers](https://oeis.org/A000217) with `scan`.
Try it!

```uiua
F = <what goes here?>
F ⇡10

[0 1 3 6 10 15 21 28 36 45]
```

*Hint: You just need `scan` and one additional glyph/function.*
