+++
title = "Types"
date = 2026-01-26
weight = 4

[extra]
doclink = "https://www.uiua.org/tutorial/Types"
showtoc = true

+++

## Challenge 1

**Write a program that increments the first character of a string**.

### C1 Solution

```uiua
⊂+1⊢⟜(↘1)
```

or the idiomatic solution

```uiua
⍜(⊢|+1)
```

**Why?**

Once you understand the idiomatic solution, there is no going back.
I solved this idiomatically but then I struggled with the intended solution.
I will admit that I just kinda forgot about `on` and made this horror

```uiua
back join dip(add 1) dip first by drop 1
˜⊂ ⊙(+ 1) ⊙⊢ ⊸↘ 1
```

But let's look at what we're trying to accomplish, step by step
Let's assume we want to turn `bingo` into `cingo`.

```uiua
# What does on look like with drop 1?
    on (drop 1) "bingo"
    ⟜(↘ 1) "bingo"
"ingo"
"bingo"

# And how is it different from by?
    by drop 1 "bingo"
    ⊸↘ 1 "bingo"
"bingo"
"ingo"

# We want to operate on "bingo" first
# Therefore we choose `on`
    first on (drop 1) "bingo"
    ⊢ ⟜(↘ 1) "bingo"
"ingo"
@b

# We want to change @b into @c
    add 1 first on (drop 1) "bingo"
    + 1 ⊢ ⟜(↘ 1) "bingo"
"ingo"
@c

# Finally we join it
    join add 1 first on (drop 1) "bingo"
    ⊂ + 1 ⊢ ⟜(↘ 1) "bingo"
"cingo"
```

**But what about the idiomatic solution?**

We have discussed `under` in chapter 2 but let's recap

> *What `under` does is transform something, apply a function to the
> transformation and then undo the transformation.*

What does `under(first|add1)` do to "bingo"?

* \- transforms `bingo` into `@b` via `first`
  * \+ You can think of this as dropping `ingo`
* \- `add 1` to `@b` making `@c`
* \- reverses the transformation
  * \+ "Undrops" `ingo` back onto `@c` making `cingo`
