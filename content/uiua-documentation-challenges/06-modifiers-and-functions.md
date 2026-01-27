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
especially with non-commutative functions like `sub`.
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
```

That *looks* right. What might we intuit about `reduce sub` from other languages?
Let's look at Ruby as an example

```ruby
[1,2,3,4,5].reduce(:-)
=> -13

1 - 2 - 3 - 4 - 5
=> -13
```

So, is Uiua the same?

```uiua
    reduce sub [1 2 3 4 5]
    /- [1 2 3 4 5]
3
```

Not the same then.
What *sort of* happens with `sub` in Uiua is comparable to

```ruby
5 - (4 - (3 - (2 - 1)))
=> 3
```

Let's work through the non-commutative consequences of Uiua, step by step.

```uiua
    - 1 2
1

# Elements 1 and 2 have been used
# Next up, element 3 
# With previous output 1
    - 1 3
2

# Element 4
# Previous output 2
    sub 2 4
    - 2 4
2

# Element 5, previous out 2
    - 2 5
3
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

You might be comfortable with reduce by now but you can read the preamble and problem 1
for a refresher.

I think it is helpful to look at two examples with reverse to see visually what rows does.

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
