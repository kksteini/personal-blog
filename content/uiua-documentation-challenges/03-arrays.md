+++
title = "Arrays"
date = 2026-01-20
weight = 3

[extra]
doclink = "https://www.uiua.org/tutorial/Arrays"
showtoc = true
+++

## Preamble

From now on, I will sometimes use the `repl` output.
See [installation](https://www.uiua.org/install). You can run it locally with
`uiua repl`.

The repl output shows a more stack like behaviour.
It grows down. I like to think of it as *whatever is at the bottom is the thing
that would get used next. The first argument.*

```uiua
    1 2.5 "3" #<- repl input line
"3"   #<- repl output start
2.5
1     #<- bottom - first argument
```

## Challenge 1

**Write a program that adds an array to its reverse**.

### C1 Solution

```uiua
+⊸⇌
```

**Why?**

The key thing to notice is that we need two arrays but `rev [1 5 9]` produces
just one array as output.

```uiua
⇌ [1 5 9]
# output: [9 5 1]
```

How do we keep the original?
This is where `by` comes in. When you use `by <some-function>` that
modified function runs, but its last argument appears after the output.
Let's make it clearer with some examples.

```uiua
# 'by' example
# Note: last argument here is 2
    ⊸+ 1 2
2
3

# If we act on the results of 'by'
# then we act on the output first
# Here that output is add 1 2, which is 3
    + 3 ⊸+ 1 2
2
6

# You can think of it like this:
# We substitute 'by add 1 2' with (3 2)
# So + 3 ⊸+ 1 2 is equivalent to 
    + 3 (3 2)
2
6
```

We can reason about `by add rev` in the same manner

```uiua
# Two arrays produced in the output
    ⊸⇌ 1_5_9
[1 5 9]
[9 5 1]

# Acting on that output with add
# Would be equivalent to 
    + 1_5_9 9_5_1
[10 10 10]

# Therefore
    +⊸⇌ 1_5_9
[10 10 10]
```

## Challenge 2

**Write a program that creates a matrix of 0's with as many rows as the first
argument and as many columns as the second argument**.

### C2 Solution

```uiua
˜↯0⊟
```

**Why?**

Let's start by taking a look at `reshape`

```uiua
    reshape 2_5 9
    ↯ 2_5 9
╭─           
╷ 9 9 9 9 9  
  9 9 9 9 9
            ╯
```

Here we have seem to have `reshape x_y fill_value`.
What we ask for with `reshape 2_5 9` is an array with two rows
and five columns, all filled with the value 9. *Note: This is technically
not true but serves as a gentle introduction to reshape. More on reshape
later*.

However, our test input is two arguments, not a `rows_columns` array.
So let's look at `couple` next. According to the documentation it
combines two arrays as rows of a new array. Since literals are
an array, like everything in Uiua, it stands to reason that we could
join them into the array input we need. Let's try it

```uiua
    ⊟ 1 2
[1 2]
```

OK great! Coupling two scalar arguments (just numbers) results in
an array of length 2 which is exactly what we want for `reshape`.

So if we try to put that together, assuming a test input of `3 5`, with the
fill value as `0`

```uiua
    ↯ 0 ⊟ 3 5
╭─       
╷ 0×2 ℝ  
        ╯
```

But that isn't right. We've given the shape of the array as `0`.
We want it to be `3_5`. Recall the `back` modifier which swaps the arguments
to a function

```uiua
    ˜↯ 0 3_5
╭─           
╷ 0 0 0 0 0  
  0 0 0 0 0  
  0 0 0 0 0  
            ╯
```

## Challenge 3

**Write a program that adds a 1-row leading axis to an array.**

### C3 Solution

```uiua
↯⊂1⊸△
```

or the idiomatic solution

```uiua
¤
```

**Why? Short edition**.

*Thank you Tyz for the feedback!*

It may be sufficient for you to understand that
*1-row leading axis to an array* just means *put the entire thing you have into
a new array as its first element*.

This means there is an alternate solution to the problem that looks like this

```uiua
    [id]
    [∘]
```

*`id` has not been introduced but should be fairly easy to understand in this context.
`[id]` is equivalent to `f(x) -> [x]`. Then `f(2)` is equivalent to `[id] 2`*

**Why? Original wall of text**.

I had a hard time even understanding what this challenge wanted.
That's not the author's fault. I had to look at the answer first and then
work backwards. After that, it clicked. I will go into a lot of
detail here and dumb it down quite a bit, but that's what I would've needed at
the time.

Let's start by understanding `shape`. The `shape` function gives us the
dimensions of an array.

```uiua
# Scalars are just a magnitude, no dimensions
    △ 1
[]

# Classic arrays are shape of [array_length]
    △ [1 2]
[2]

    △ 1_2_3_4
[4]

# Two dimensional arrays are the shape [rows columns]
    △ [1_2_3 4_5_6]
[2 3]

# You can think of the shape [2 1 3] as 
# two rows of 1x3 two dimensional arrays
    △ [[1_2_3] [4_5_6]]
[2 1 3]
```

That should give you some idea of shapes.

You can however play around with this yourself.
I'm not going to explain inverses right now but
try out `un shape` to generate arrays based on the shape you supply.
For example

```uiua
# I want an array of shape [1 4] 
    °△ [1 4]
╭─         
╷ 0 1 2 3  
          ╯

# Shouldn't that have been a one dimensional array? 
# What about [4]?
    °△ [4]
[0 1 2 3]

# Ah I see. 
# The lines (╭, ╷) on the side denote dimensions
    °△ [2 4]
╭─         
╷ 0 1 2 3  
  4 5 6 7  
          ╯

# So a 3D matrix has three lines on the side, right?
    °△ [3 2 1]
╭─        
╷ 0  2  4  
╷ 1  3  5  
          ╯

# What about a 7D monster, just because?
    °△ [1 1 1 1 1 1 1]
╭─   
╷    
╷    
╷    
╷ 0  
╷    
╷    
    ╯
    
```

Let's talk about what the challenge wants you to do.
Whatever shape of array you have, add a leading 1 to the shape.
If the shape was `[]` make it `[1]`, if you have the shape `[x]` make it
`[1 x]`, if you have the shape `[a b c d e f ...]` make it `[1 a b c d e f ...]`.

Finally, let's reason out a solution, step by step. Let's assume a test
input of `[20 40]`

```uiua
# What is the shape of our test input?
    △ [20 40]
[2]

# So, we want to reshape it to [1 2]
# What does that look like?
    ↯ [1 2] [20 40]
╭─       
╷ 20 40  
        ╯
# Reshape definitely does that, right?
# What is the shape after reshaping?
    △ ↯ [1 2] [20 40]
[1 2]

# Alright. But we want a generalized solution
# Can't we use 'by' to look at a shape and not discard?
    ⊸△ [20 40]
[20 40]
[2]

# Ok, that leaves us with [2] as a first argument
# Let's imagine we join that with 1.
# 1 of course being what we want to add to a shape
    ⊂ 1 [2]
[1 2]

# So, putting that together, can we end up with
# the correct arguments to reshape?
    ⊂ 1 ⊸△ [20 40]
[20 40]
[1 2]

# So the whole solution for this test input
# is reshape join 1 by shape [20 40]
    ↯ ⊂ 1 ⊸△ [20 40]
╭─       
╷ 20 40  
        ╯
```

## Challenge 4

**Write a program that prepends the first row of the first argument to the
second argument**.

### C4 Solution

My initial solution

```uiua
⊂⊏0
```

Intended solution

```uiua
⊂⊢
```

**Why?**

Let's experiment towards a solution

```uiua
    ⊏ 0 [1 2 3]
1

# What about a shape [3 2] array?
    ⊏ 0 [5_6 7_8 9_0]
[5 6]

# Ok, so is join the command we want?
    ⊂ 5_6 1_2_3
[5 6 1 2 3]

# Can't we then just put them together?
    ⊂ ⊏ 0 [1 2 3] 4_5_6
[1 4 5 6]
```

Note, that you can instead of `select 0` just write `first`.
I show my initial solution here as a reminder that
even if you manage to solve the problems, you should always
look at the intended solution (and even the idiomatic solution).
I managed to gloss over `first` while still figuring out a way
around it.

## Challenge 5

**Write a program that removes the first and last rows from an array**.

### C5 Solution

```uiua
↘1↘¯1
```

**Why?**

Let's use `[1 2 3 4 5]` as an example. We want to end up with
`[2 3 4]`. Let's experiment with drop and take

```uiua
# Our input looks like this
    1_2_3_4_5
[1 2 3 4 5]

# What if we take 1?
    ↙ 1 1_2_3_4_5
[1]


# That wasn't it. What about drop?
    ↘ 1 1_2_3_4_5
[2 3 4 5]

# We can use ``1` for a negative drop?
    ↘ ¯1 1_2_3_4_5
[1 2 3 4]

# Putting it together
    ↘ 1 ↘ ¯1 1_2_3_4_5
[2 3 4]
```

## Challenge 6

**Write a program that prepends an array as an item to a list of boxed arrays**.

### C6 Solution

```uiua
⊂□
```

**Why?**

Let's discuss briefly what `box` and something being boxed means.
What does boxing solve?

> *□ box creates a box element that contains the array. All boxes, no matter
> the type of shape of their contents, are considered the same type and can be
> put into arrays together.*
>
> From [Uiua.org/docs/box](https://uiua.org/docs/box)

```uiua
# Example from the documentation
    [□ @a □ 3 □ 7_8_9]
[@a│∙3│7 8 9]

# Note: You can use { } as a box shorthand
    {@a 3 7_8_9}
[@a│∙3│7 8 9]
```

Another thing worth mentioning is string arrays in Uiua.
What is your intuition on string arrays. Let's pick some languages at random

```typescript
// Typescript, this is fine
const someArray = ["bingo", "buddies"];
```

```rust
// Rust, this is fine
let some_array = vec!["bingo", "buddies"];
```

But then we come to Uiua.

```uiua
    ["bingo" "buddies"]
Error: Cannot combine arrays with shapes [5] and [7]

# So strings have shapes
    △ "bingo"
[5]

# But what is the shape of a box?
    △ □ "bingo"
[]
    △ □ "buddies"
[]

# Alright, so having the same shape they
# can be put into an array
    {"bingo" "buddies"}
["bingo"│"buddies"]
```

The challenge wants us to prepend whatever we receive to a list of boxed arrays.
Our first argument is the thing to prepend and our second argument is the list.
We simply `box` our first argument and then call `join`.
Because we read right to left we end up with `join box` instead of `box join`.
This will be the last right to left reminder.

Assume input `1_2 [□ 1 □ 2]`

```uiua
# First we box
    □ 1_2
□[1 2]

# Then we join
    ⊂ □[1_2] [□ 1 □ 2]
[1 2│∙1│∙2]
```
