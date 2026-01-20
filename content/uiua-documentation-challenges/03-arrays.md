+++
title = "Arrays"
date = 2026-01-20
weight = 2

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

**Write a program that creates a matrix of 0's with as many rows as the first argument and as many columns as the second argument**.

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

**Why?**

I had a hard time even understanding what this challenge wanted.
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

You should however play around with this yourself.
I'm not going to explain inverses right now but you can
try out `un shape` to generate arrays based on the shape you supply. This may
give you a better idea. Supply the shape, and Uiua provides. For example

```uiua
# I want an array of shape [1 4] 
    °△ [1 4]
╭─         
╷ 0 1 2 3  
          ╯

# Wasn't that just an array? What about [4]?
    °△ [4]
[0 1 2 3]

# Ah I see. 
# The lines (╭, ╷) on the side denote dimensions
    °△ [2 4]
╭─         
╷ 0 1 2 3  
  4 5 6 7  
          ╯

# So a matrix has three lines on the side, right?
    °△ [3 2 1]
╭─        
╷ 0  2  4  
╷ 1  3  5  
          ╯

# What about a 7-dimensional monster, just because I can?
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
# The correct arguments to reshape?
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
