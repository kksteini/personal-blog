+++
title = "More Argument Manipulation"
date = 2026-02-02
weight = 7

[extra]
doclink = "https://www.uiua.org/tutorial/More%20Argument%20Manipulation"
showtoc = true
+++

## Preamble

There is a lot of noise here. Feel free to look at the challenges and then refer
back to my preamble sections if they seem relevant.

### Array compaction

I often compact argument output by wrapping the problem in an array
`[dip add 1 2 3]` vs `dip add 1 2 3` for example:

```uiua
    [⊙+ 1 2 3]
[1 5]
    ⊙+ 1 2 3
5
1
```

You can surround a Uiua program, or commands, in brackets. Any output generated
by the program will then be put into the array. Another example:

```uiua
    [+ 1 2 - 3 4 × 5 6 ÷ 7 8]
[3 1 30 1.1428571428571428]
```

### A short fork reminder

A `fork` takes two functions an runs them on the same input.
Consider two functions, `reduce add` and `reduce back sub`.

```uiua
# First 'reduce add' runs on the input and gives back 6
# Then 'reduce back add' runs on the input and gives back 0
    ⊃/+/˜- [3 2 1]
0
6

# Function boundaries will become second nature once you
# get familiar enough with Uiua. 
# You can use parentheses to
# visualize the boundaries better.

    ⊃(/+)(/˜-) [3 2 1]
0
6

```

### Function boundary

I use the term *function boundary* somewhat.
This is not an official term but I like to use it when I reason about
functions as inputs.

In very simplified terms, the Uiua parser parses functions with its modifiers
and those together make a function boundary or just simply a function.

For example, if a function takes two functions as input, then the next two
function boundaries will serve as input to that function.

```uiua
# Following fork is 4 symbols and 1 argument
# However, self(˙) is a modifier and is therefore a part of a function boundaries
# when followed by non-modifier symbol
    [⊃˙×˙+ 5]
[25 10]

# Function boundaries highlighted with parentheses
    [⊃(˙×)(˙+) 5]
[25 10]
```

Parentheses, of course, make a function boundary even if there are multiple
functions within. In those cases, parentheses serve an actual functional purpose,
instead of just highlighting as above. As an example:

```uiua
# Add n and then multiply by itself
# This is two functions
# Doing this twice would be four functions
# This is where parentheses represent a function boundary of 
# two functions
    [fork (self mul add 1) (self mul add 3) 1]
    [⊃(˙× + 1) (˙× + 3) 1]
[4 16]
```

### Planet notation

I urge you to read the planet notation section in the documentation
for this chapter while focusing on `dip`, `gap` and `id`.
The `pop` function is easy to understand once you get those three down.

It took me some time to understand `dip`, `gap` and `id`.
It helps to remember that `dip` and `gap` take a function, and then
some arguments, whereas `id` simply returns whatever argument is next.

**Let's consider the difference between `dip` and `gap`.**

```uiua
# dip (and gap) needs a function 
# and then some arguments
# 
# Let's break down `dip add 1 2 3`
# dip add   1 2 3
#      |    | | |
#     func  \ | /
#            arguments
# ---------------------
    [⊙+ 1 2 3]
[1 5]

# So step by step:
#   dip modifies the add function
#   dip skips and 'banks' the first argument, 1
#   add receives the arguments 2 3
#   add computes 5
#   dip puts down the banked 1 
#   then comes the computation, 5.
# End result, [1 5].

# The difference with gap is that it doesn't 
# give back the skipped argument:
    [⋅+ 1 2 3]
[5]
```

OK, but where does `id` come in? Why is it considered a planet?

```uiua
# Consider, for example, `gap 1 2 3`

# gap   1 2 3
#       \ | /
#     arguments?

# Gap should just skip the 1st argument, right?
# So we expect this to be [2 3]
    [⋅1 2 3]
[1 3]

# That's not right.
# What is actually happening is the following:

# gap 1          2 3
#     |          \ /
#  'func'  next arguments

# 1 'kinda' is a  zero argument function that returns 1. 
# Even if 1 takes no arguments,
# gap skips the next argument in the argument list, 2.
# Gap 'applies' the function 1.
# The rest of the program, 3, runs.
# End result is [1 3].

# So how do we fix this?
# Make sure 1 is not in gap's 'func' position.
# Put an id in there

# gap id   1 2 3
#      |   | | |
#    func  \ | /
#         arguments

    [⋅∘ 1 2 3]
[2 3]

# Here, id is the function.
# 1 is skipped, and discarded.
# Id is applied to the argument, 2.
# The rest runs, we end up with [2 3]
```

#### Planet notation shorthand

```uiua
# The formatter is ok with simply g, d, p and i 
# for gap, dip, pop and id.
    dgi 1 2 3
    ⊙⋅∘ 1 2 3
3
1

    dgp 1 2 3
    ⊙⋅◌ 1 2 3
1

# Though you need more than one
    g 1 2 3
Error: Unknown identifier `g`
```

## Challenge 1

**Write a program that moves the 4th argument in front of the first**.

### C1 Solution

```uiua
⊃(⋅⋅⋅∘)(⊙⊙∘)
```

or without parentheses

```uiua
⊃⋅⋅⋅∘⊙⊙∘
```

and then the idiomatic solution

```uiua
⤙⊙⊙⊙◌
```

**Why?**

Let's start by isolating the 4th argument.

```uiua
# 1 2 3   4
# | | |   |
# \ | /   \
#   |      Want to keep this
#   |
# Want to skip these

# Surely we can then gap the first 3 arguments
# and id the last, right?
    ⋅⋅⋅∘ 1 2 3 4
4
```

Indeed we can. But what about the first three?

```uiua
# Gap skips and discards, but dip does not discard. 
# For the first three we want to keep them all.
# Thus, keeping 1 2 3 out of 1 2 3 4 should be
# dip dip id
    [⊙⊙∘ 1 2 3 4]
[1 2 3 4]
```

But hang on a minute, we get back `[1 2 3 4]`? Let's call this **confusion 1**.

We do of course correctly get back `[1 2 3 4]`. We keep the first three, but
there is nothing acting on the last argument 4. The last argument just *plops
itself* into the list after `dip dip id` finishes targeting and keeping `1 2 3`.

**Dip and id discomfort?**

As a beginner I didn't like reasoning with dips and ids as the result was
the same as the input. It became clearer once I isolated it with a fork.
Consider the following from the [fork docs](https://www.uiua.org/docs/fork)
> If the \[forked\] functions take different numbers of arguments,
> then the number of arguments is the maximum. Functions that take fewer than
> the maximum will work on the top values.

Let's examine `dip dip id` with this knowledge in mind

```uiua
# We expect 'dip dip id' to work on three arguments
# Let's use fork 
# We'll put 'dip dip id' as the first fork function
# and then use something that takes no arguments:
#   →just the number 0

# If 'dip dip id' *returns* 1 2 3 4 as in *confusion 1*
# then we'd expect to see [1 2 3 4 0]
# Because the inputs captures would be 1 2 3 4 and then 0
    [⊃(⊙⊙∘)(0) 1 2 3 4]
[1 2 3 0 4]

# This proves that dip dip id only runs on arguments 1 2 3
# Dip dip id returns 1 2 3, the first capture of the array
# Then the 0 in the fork, the second capture
# Then finally 4 is leftover and is the third and final capture
```

**Putting it together**.

We've found a way to get the fourth argument and to keep only the first three.
Knowing what we know, let's fork together.

```uiua
# First part is 'gggi'
# Second part is 'ddi'
    fork(gggi)(ddi) 1 2 3 4
    ⊃(⋅⋅⋅∘)(⊙⊙∘) 1 2 3 4
3
2
1
4
```

**What about the idiomatic solution?**

From the [with docs](https://www.uiua.org/docs/with)
> Call a function but keep its last argument before its outputs

I think the documentation examples are pretty good for understanding `with`

```uiua
# 5 is the last argument
# 7 is the output of 2 + 5
    [⤙+ 2 5]
[5 7]

# 5 is the last argument
# 3 is the output of 5 - 2
    [⤙- 2 5]
[5 3]
```

If we have the inputs `1 2 3 4` then we just need something to output `1 2 3`
that still consumes `4`.

Our first instinct might be to use the familiar `dip dip id` for `1 2 3`.
If we do that, can't we then just `pop` to discard the `4` somehow?

```uiua
    with dip dip id pop 1 2 3 4
    ⤙⊙⊙∘ ◌ 1 2 3 4
4
3
2
4
```

Hmm, no. That doesn't do what we want.
The problem is that `id` and `pop` create function boundaries and
therefore the `pop` targets the `1`, it does not get carried
along to target the `4`.

But why use the `dip dip id` from before?
Let's triple dip (radical!) and then finally pop the 4 to discard it.
Then `with` should still identify `4` as its last argument, push it to the front
and then the triple dip outputs `1 2 3`

```uiua
    with dddp 1 2 3 4
    ⤙⊙⊙⊙◌ 1 2 3 4
3
2
1
4
```

## Challenge 2

**Write a program that finds both the sum and product of three arguments**.

### C2 Solution

The intended solution

```uiua
⊃(++|××)
```

and an equivalent solution with boundaries instead of packing

```uiua
⊃(++)(××)
```

**Why?**

The intended solution uses function packing to create a clear boundary for fork.
Trying the idiomatic solution without packing comes with problems.

```uiua
    ⊃++×× 1 2 3
Error: Missing argument
```

Again, there are 4 functions there, not 2.
By packing them into `(program1|program2)` we give fork two functions.

```uiua
    ⊃(++|××) 3 4 5
60
12
```

**How is packing different from creating boundaries?**

In this particular challenge, not very different.
However, observe the following:

```uiua
# We fork three functions instead of 2
    ⊃(++|×+|××) 1 2 3
6
9
6

# Can we just supply three functions to fork?
    ⊃(++)(×+)(××) 1 2 3
Error: Missing argument 2
  at 1:1

# No. Not at all
```

With fork, function packing is a way to control how many functions are
forked on the same input. They can be 2 or more.
They can also be singular or none.

```uiua
    ⊃(++|) 1 2 3
6

    [⊃(|) 1 2 3]
[1 2 3]
```

## Challenge 3

**Write a program that collects 9 values from the stack evenly into 3 arrays**.

### C3 Solution

```uiua
∩₃⊟₃
```

**Why?**

I would recommend reading over the [both docs](https://www.uiua.org/docs/both).

Now, from the doc, consider the following:
> For a function that takes n arguments, ∩ (both) calls the function on the
> 2 sets of n arguments.

What does this mean?

```uiua
# We know that (++) requires 3 arguments
#   so n = 3
# This means that if we supply (++) to both,
# then the modified function should consume 2*n = 6 args.
    ∩(++) 1 2 3 4 5 6
15
6
```

Then consider:
> Subscripted ∩ (both) calls its function on N sets of arguments.

```uiua
# (++) requires 3 args, n = 3
# subscript is 3, so N = 3
# N sets of n args = N * n = 9 args
    ∩₃(++) 1 2 3 4 5 6 7 8 9
24
15
6
```

Now remember `couple`.
It similarly has a subscript that tells it how many arguments it should collect.

```uiua
# Let's couple 4 and then 3 with input 1 2 3 4

# All four are coupled 
    ⊟₄1 2 3 4
[1 2 3 4]

# First three are coupled 
    ⊟₃1 2 3 4
4
[1 2 3]
```

OK, so subscripted couple is fairly straightforward.

Now, the challenge!
We want to collect 9 values evenly into 3 arrays.
So that would be 3 values per array, 3 times.
We collect 3 at a time, `couple,3`.
The input length is 9 so we run 3 sets of `couple,3` using `both,3`.

```uiua
    ∩₃⊟₃1 2 3 4 5 6 7 8 9
[7 8 9]
[4 5 6]
[1 2 3]
```
