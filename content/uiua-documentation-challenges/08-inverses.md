+++
title = "Inverses"
date = 2026-02-23
weight = 8

[extra]
doclink = "https://www.uiua.org/tutorial/More%20Argument%20Manipulation"
showtoc = true
+++

## Preamble

### On the documentation

The documentation for inverses is good. I urge you to read and re-read while
also following along with the suggestions such as looking at the
[un compatible list](https://www.uiua.org/docs/un).

#### Under especially

I'd like to highlight the following block of the Uiua Inverses doc.

> `under` takes two functions which we will call `F` and `G`.
> It calls `F`, then calls `G`, then "undoes" `F`.
> While under sometimes uses `un F` as its undoing function, many functions
> that do not work with `un` work with `under` because `under` can keep track of
> **context**. One example of this in action is `under pick`, which allows us to
> modify an element or row of an array.

```uiua
    ⍜(⊡2|×10) [1 2 3 4]
[1 2 30 4]
```

> *-Uiua docs*

The **context** in this case is the array. Let's examine

```uiua
# Let's select elements 1 and 3 out of an array
    ⊏ 1_3 [1 2 3 4 5]
[2 4]

# The 'context' for the selection is
# the array [1 2 3 4 5]

# Now let's consider under on this selection
# and do something simple like adding 100
    ⍜(⊏ 1_3|+ 100) [1 2 3 4 5]
[1 102 3 104 5]

# So tracing the steps very informally:
# [2 4] is selected. 
#   Context is [1 HERE 2 3 ALSO_HERE 5]
# [2 4] has +100 applied → [102 104]
# Now under, keeping the context,
# knows to replace HERE with 102 and ALSO_HERE with 104
# Hence output: [1 102 3 104 5]
```

## Challenge 1

**Write a program that adds 100 to the 2nd and 4th rows of an array**.

### C1 Solution

```uiua
⍜(⊏1_3|+100)
```

and the idiomatic solution

```uiua
⍜⊙⊏+ 100 1_3
```

**Why?**

See [preamble section on under](#under-especially).

```uiua
# Under does F, applies G and finally undoes F.
# Let's break down the F and G of `under(F|G)`

# F: If we only run select 1_3 on an array
#  We get back the list of selections
    ⊏ 1_3 [100 90 80 70 60]
[90 70]

# G: Then operating on those
    + 100 [90 70]
[190 170]

# Under however keeps the context,
# the original array [100 90 80 70 60] selected from,
# and returns the altered elements to their previous
# places: 

# You can imageine [100 PREV 80 PREV_2 60]
# PREV originally 90, PREV_2 originally 70
# G is applied, resulting in [190 170]
# In undoing F:
# - 190 is slotted into PREV
# - then 170 is slotted into PREV_2

    ⍜(⊏ 1_3|+ 100) [100 90 80 70 60]
[100 190 80 170 60]
```

**What about the idiomatic solution?**.

```uiua
⍜⊙⊏+ 100 1_3

# Looking at this function in isolation is perhaps confusing
# Why do we need dip there? Why can't we just omit the dip
# and reverse the inputs? Let's try it with [1 2 3 4 5]
    ⍜⊏+ 1_3 100 [1 2 3 4 5]
Error: Index 1 is out of bounds of length 1

# Ah, so `select 1_3` tries to operate on `100`.
# Well, after parsing `select 1_3`, 
# the arguments at this point are 100 [1 2 3 4 5].
# Of course we have to skip over the 100

# But isn't this then a symptom of test cases
# The dip is there to deal with the test input appearing last, innit?
# So what if that weren't the case
    ⍜⊏ + 1_3 [1 2 3 4 5] 100
[1 102 3 104 5]

# So, in a pure sense we can write
# `under F G <args for F> <args for G>`
    ⍜⊏ + (1_3 [1 2 3 4 5]) (100)
[1 102 3 104 5]
```

## Challenge 2

**Write a program that transposes an array so that the last axis becomes the first**.

### C2 Solution

```uiua
°⍉
```

**Why?**

*Disclaimer: 3D, or higher dimensional transformations, are
not my specialty. In fact, I know very little. I think they are more useful
in understanding the solution, when using shape.
Take the following with a grain of salt.*

```uiua
# Let's make a 3D array to play with
    F ← °△ 2_3_4

# What does F look like?
    F
╭─
╷ 0 1  2  3  12 13 14 15
╷ 4 5  6  7  16 17 18 19
  8 9 10 11  20 21 22 23
                         ╯
# unshape 2_3_4 gives the right shape?
    △ F
[2 3 4]

# What does a transform on F look like?
    ⍉ F
╭─
╷ 0 12  4 16   8 20
╷ 1 13  5 17   9 21
  2 14  6 18  10 22
  3 15  7 19  11 23
                    ╯
# Then the shape?
# Seems like the shape "rotated" such that
# the first element loops back to the end
    △ ⍉ F
[3 4 2]

# Wouldn't then untransform "rotate" the other way?
# The last element loops back to the beginning?
# The problem statement wants 'the last axis to become the first'
# So this seems like a good candidate

# The solution, untransform,
# what does that look like?
    °⍉ F
╭─
╷  0  4  8   1  5  9   2  6 10   3  7 11
╷ 12 16 20  13 17 21  14 18 22  15 19 23
                                         ╯
# Does it "rotate" the shape like we want? 
# Looks like it does
    △ °⍉ F
[4 2 3]

# But, for a 3D matrix that's the same as transforming twice?
    △ ⍉ ⍉ F
[4 2 3]

# Indeed it is
    ⍉ ⍉ F
╭─
╷  0  4  8   1  5  9   2  6 10   3  7 11
╷ 12 16 20  13 17 21  14 18 22  15 19 23
                                         ╯
```

**But what does a transform mean? What is it?**

I am not too sure myself. I would appreciate some correspondence here from
people more knowledgable. Feel free to mail to: <uiuachallenges@anub.is>.
I feel like "drawing" a cube of numbers for a 3D matrix helps me
understand it a little in the context of the transformation.

**I present to you, in all its glory, an image drawn by the hand of someone who
holds a pen once every 6 months.**

<img alt="Cubes" src="/images/chapter08-challenge2.png"/>
