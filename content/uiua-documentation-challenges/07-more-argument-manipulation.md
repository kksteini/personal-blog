+++
title = "More Argument Manipulation"
date = 2026-02-02
weight = 7

[extra]
doclink = "https://www.uiua.org/tutorial/More%20Argument%20Manipulation"
showtoc = true
+++

## Preamble

### Planet notation

I urge you to read and reread the planet notation section in the documentation
for this chapter.

*Note: I recommend focusing on `dip`, `gap` and `id` first.
Pop is easy to understand once you get those three down.*

It took me some time to understand `dip`, `gap` and `id`.
It helps to consider strongly that `dip` and `gap` need a function and then
some arguments, whereas `id` simply returns whatever argument is next/selected.

**Let's consider the difference between `dip` and `gap`.**

*Reminder: I sometimes compact argument output by wrapping the problem in an array*
`[gap add 1 2 3]`*vs* `gap add 1 2 3` *in the repl. Try the difference for yourself.*

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
#   dip feeds add the arguments 2 3
#   add computes 5
#   dip puts down the banked 1 
#   dip puts down the the computation.
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

# gap 1     2 3
#     |     \ /
#  'func'  arguments

# 1 'sort of' is a function.
# Gap then skips the first argument, 2.
# Gap 'applies' the function 1.
# The rest of the program, 3, runs.
# End result is [1 3].

# So how do we fix it?
# Make sure 1 is not in a 'func' position.

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
```

### A short fork intro

A `fork` takes two functions an runs them on the same input/s.
Consider two functions, `reduce add` and `reduce back sub`.

```uiua
# First 'reduce add' runs on the input and gives back 6
# Then 'reduce back add' runs on the input and gives back 0
    ⊃/+/˜- [3 2 1]
0
6

# Function boundaries will become second nature once you
# get familiar enough with Uiua. 
# But I found it clearer in the beginning to function pack
    ⊃(/+|/˜-) [3 2 1]
0
6
```

## Challenge 1

**Write a program that moves the 4th argument in front of the first**.

### C1 Solution

```uiua
⊃(⋅⋅⋅∘|⊙⊙∘)
```

or without function packing

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
    [⋅⋅⋅∘ 1 2 3 4]
[4]
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

# So the maximum of arguments is 3
# If 'dip dip id' *returns* 1 2 3 4 as in *confusion 1*
# then we'd expect to see [1 2 3 4 0]
# However:
    [⊃(⊙⊙∘|0) 1 2 3 4]
[1 2 3 0 4]
```

**Putting it together**.

We've found a way to get the fourth argument and to keep only the first three.
Knowing what we know, let's fork together.

```uiua
# First part is 'gggi'
# Second part is 'ddi'
    fork(gggi|ddi) 1 2 3 4
    ⊃(⋅⋅⋅∘|⊙⊙∘) 1 2 3 4
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

My initial naive approach

```uiua
⊃/+ /× ⊟₃
```

and the intended solution

```uiua
⊃(++|××)
```

**Why?**

I show you the naive approach to emphasize function packing.
If there was no function packing then this solution, or a solution like it,
would be necessary.

The `add` and `mul` functions by themselves create a function boundary.
Since `reduce add` and `reduce mul` are their own boundaries, they could work
with an input `[1 2 3]`. We may remember that `couple,3` will do that.

```uiua
    ⊟₃1 2 3
[1 2 3]

    ⊃/+ /× ⊟₃1 2 3
6
6
```

The intended solution uses function packing to create a clear boundary for fork.
Trying the idiomatic solution without packing comes with problems.

```uiua
    ⊃++×× 1 2 3
Error: Missing argument
```

There are 4 functions there, not 2.
By packing them into `(program1|program2)` we *essentially* give fork two functions.

```uiua
    ⊃(++|××) 3 4 5
60
12
```
