+++
title = "Math and Comparison"
date = 2026-01-12
weight = 2

[extra]
doclink = "https://www.uiua.org/tutorial/Math%20and%20Comparison"
showtoc = true
+++

## Challenge 1

**Write a program that for arguments A, B, and C, computes (A + B) × C.**

### C1 Solution

```uiua
×+
```

**Why?**

It's helpful to look at the arguments and work backwards from that.
When we have arguments `A B C` notice that `A B` comes first.
Let's set `A B C` to `1 2 3`.

```uiua
+ 1 2 3
# We see + with its arguments 1 2
# We have (+ 1 2) 3
# or (+ A B) C
# output: 3 3
# or
# output: (A+B) C
```

So, putting an `add` at the front results in `D C` where `D = A + B`.
We now just have to use a `mul` function, or `mul D C`.
Remember that we read from right to left and therefore we consider `add` to be on
the front with `mul` behind it.

## Challenge 2

**Write a program that calculates the equation √(A² + B), where A is the
first argument and B is the second.**

### C2 Solution

```uiua
√+˙×
```

Alternatively we could use `pow 2`

```uiua
√+ⁿ2
```

**Why?**

Again, this is an exercise in reading right to left and getting a feeling for
how arguments are used/consumed.

Let's see how we would work backwards. Let's use `3 16` for `A B`.

```uiua
˙× 3 16
# output: 9 16
# We now have A² B as arguments 

+ 9 16
# output: 25
# We now have the argument C, where C = A²+B

√ 25 
# output: 5
# We now have sqrt(C)
```

**What about the idiomatic solution?**

```uiua
⍜˙×+
```

*I am not going to go through `under` here in great detail. There will be a
thorough discussion of inverses later.*

What `under` does is transform something, apply a function to the
transformation and then undo the transformation.
Here is what happens in the idiomatic solution:

* `under` transforms the first argument, `A`, by squaring it
* `under` then adds together `A² + B`
  * → let's refer to this result as `C`
* `under` computes the inverse of `self mul` which is `sqrt`
* `under` applies this inverse to the first argument, `C`
