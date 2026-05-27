+++
title = "Macros"
date = 2026-05-27
weight = 13

[extra]
doclink = "https://www.uiua.org/tutorial/Macros"
toc = true

[taxonomies]
categories = ["uiua-challenges"]
tags = ["uiua"]
+++

## Preamble

These challenges are solved using index macros.
There is another type of macro, the code macro,
that *generates* Uiua code to be run.
They are even so powerful that they can create
bindings. It's fun reading about though
personally I have not used them much.

## Challenge 1

**Write a program that creates a macro called F!
which calls its function on each row of an array,
reverses each row, and reverses the whole array.**

### C1 Solution

```uiua
F! ← ⇌≡(⇌^)
```

Or explicitly

```uiua
F! ← ⇌≡(⇌^0)
```

**Why?**

The program we're being asked to write is not that complicated, it's just about
how we get there and understanding what a macro does.
Let's start by choosing a function, say `self add`, that multiplies
a number by two.

If we multiply each row of an array by two, reverse the row and then reverse
the whole array it looks like this

```uiua
    ⇌ ≡(⇌˙+) [1_2_3 4_5_6 7_8_9]
╭─
╷ 18 16 14
  12 10  8
   6  4  2
           ╯
```

If we deem the action of applying functions this way useful, we can
generalize it with a macro. To make it an index macro we define the same
operations, except, we substitute `self add` with `^`.
I think it's helpful to think of index macros as
being text substitutions on code.
Let's look at the function `self mul`, provide it to the macro and then
run it again as if it were substituted

```uiua
    F! ← ⇌≡(⇌^0)

    F!˙× [1_2_3 4_5_6 7_8_9]
╭─
╷ 81 64 49
  36 25 16
   9  4  1
           ╯
```

Invoking `F! self mul` is the same thing as substituting the `F!` definition
with `self mul` where `^` appears.

```uiua
    ⇌ ≡(⇌ ˙×) [1_2_3 4_5_6 7_8_9]
╭─
╷ 81 64 49
  36 25 16
   9  4  1
           ╯
```

## Challenge 2

**Write a program that creates a macro called F‼ which calls its first
function, then its second, then its first again.**

### C2 Solution

```uiua
    F‼ ← ^0^1^0
```

**Why?**

Let's say we want to create a function that multiplies a number by three, adds one
and then multiplies by three again.

We might do it like this

```uiua
    H ← +₁
    G ← ×₃
    F ← H G H

    F 5
19
```

In `F`s body we have two functions, three function invocations.
There is an easy way to convert this to an index macro
by substituting the functions with `^n` where `n` represents
the argument position into the macro. The first function
is `n=0`, the second `n=1` and so on.
Let's substitute `H → ^0` and `G →^1`.
Just remember that a macro needs to be defined with `!`s as
many as there are `^`s.

```uiua
    F ← H G H
    F‼ ← ^0^1^0
```

and we can invoke it like so

```uiua
    F‼+₁×₃ 5
19
```

At this point we do have what is asked for. A macro that calls its first
function, then second, then again its first.

We can do whatever. Why not get a number's largest prime factor,
square it and get the largest prime factor of the result

```uiua
    F‼(⊣°/×)˙× 11
11
    F‼(⊣°/×)˙× 13
13
    F‼(⊣°/×)˙× 15
5
    F‼(⊣°/×)˙× 16
2
```
