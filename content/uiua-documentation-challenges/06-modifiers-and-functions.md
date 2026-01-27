+++
title = "Modifiers and Functions"
date = 2026-01-26
weight = 6

[extra]
doclink = "https://www.uiua.org/tutorial/Modifiers%20and%20Functions"
showtoc = true
+++

## Preamble

We'll be using `reduce`.
If you're familiar with reduce from other languages, be careful about the specifics,
especially with functions like `sub` and `div`. Their order of operation might
go against your intuition from other programming languages..

With prior experience, your mental model of a reduce might be something
like this
> *For an array, `reduce <function>` will
> apply the function on all elements of the array, pairwise left to right,
> while keeping a running score.*

And is that right?

```uiua
    reduce + [5 10 15]
    /+ [5 10 15]
30

# Huh, shouldn't this be -13?
    reduce sub [1 2 3 4 5]
    /- [1 2 3 4 5]
3
```

We can quickly examine the consequences of the order in which Uiua
operates with functions such as `sub` and `div` with the following
typescript example:

```typescript
> [1,2,3,4,5].reduce((a,b) => a-b)
-13

> [1,2,3,4,5].reduce((a,b) => b-a)
3
```

If you really want the former you can simply use the back modifier

```uiua
    reduce back sub [1 2 3 4 5]
    /˜- [1 2 3 4 5]
```

```

## Challenge 1

**Write a program that calculates the product of the first n positive integers**.

### C1 Solution

```uiua
/×+1⇡
```

or the idiomatic solution

```uiua
/×⇡₁
```

**Why?**

Let's take `n=5` as an example and work through it step by step

```uiua
# What is the product?
    mul mul mul mul 1 2 3 4 5
    × × × × 1 2 3 4 5
120

# We can't just write mul over and over
# We can use `reduce mul` instead
    reduce mul [1 2 3 4 5]
    /× [1 2 3 4 5]
120

# Ok, but let's not write out
# 1 2 3 4 5. Range to the rescue
    ⇡5
[0 1 2 3 4]

# Let's add 1 to the range
    +1 ⇡5
[1 2 3 4 5]

# Putting it all together
    reduce mul add 1 range 5
    /× + 1 ⇡ 5
120
```

**But what about the idiomatic solution?**

[The Uiua docs page for subscripts](https://www.uiua.org/docs/subscripts) is
worth skimming through. Basically, using a comma, `,`, after a function and then
following it with
a number, will create a subscript for that function.
These have varying properties and it is good to read the documentation for a
function to gauge it.

Try that now:
[The Uiua docs for range](https://www.uiua.org/docs/range) has a section in it
that explains what happens.

```uiua
# Why was six afraid of seven?
    range,7 9
    ⇡₇9
[7 8 9]
```

## Challenge 2

**Write a program that adds each column of a matrix to the next**.

### C2 Solution

```uiua
≡/+
```

**Why?**

You might be comfortable with reduce by now but you can read the preamble and
problem 1 for a refresher.

I think it is helpful to look at two examples with reverse to see visually what
rows does.

```uiua
# Reverses each row. 1_2_3 → 3_2_1
    rows reverse [1_2_3 4_5_6 7_8_9]
    ≡⇌ [1_2_3 4_5_6 7_8_9]
╭─       
╷ 3 2 1  
  6 5 4  
  9 8 7  
        ╯

# Reverse here is not modified to
# operate on rows. Therefore the 
# whole 2D array is reversed instead
    reverse [1_2_3 4_5_6 7_8_9]
    ⇌ [1_2_3 4_5_6 7_8_9]
╭─       
╷ 7 8 9  
  4 5 6  
  1 2 3  
        ╯
```

#### Exercise C2-1

What is the difference between `reduce add [1_2_3 4_5_6 7_8_9]` and
`rows reduce add [1_2_3 4_5_6 7_8_9]`?
