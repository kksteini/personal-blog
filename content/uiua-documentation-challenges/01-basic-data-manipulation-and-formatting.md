+++
title = "Basic Data Manipulation and Formatting"
date = 2026-01-05
weight = 1

[extra]
doclink = "https://www.uiua.org/tutorial/Basic%20Data%20Manipulation%20and%20Formatting"
showtoc = true
+++

## Preamble

In many mentions and external resources on Uiua you will read about a
stack or see Uiua itself being described as stack based.

In the beginning I liked thinking of Uiua as stack based to
help me grapple with the language.
I would think of it like this

```uiua
+ 1 2 3

# A number is a function that pushes itself onto the stack
# 3 gets pushed onto the stack
# 2 gets pushed onto the stack
# 1 gets pushed onto the stack

# add acts on 1 and 2 on the stack
# 1 and 2 are removed, added together
# and three is now pushed back on the stack

# The stack becomes 3 3
```

The current vision for Uiua, to my knowledge, is that the
stack is to be de-emphasized in favour of arguments and modifiers for
argument manipulation.

We still read the order of operations from right to left.
Paraphrased from the documentation: *Operations, such as **add**, have their
arguments appear to their right.*

```uiua
+ 1 2 3

# We read 3
# We read arguments 1 and 2 with their operand +
#   that is to say (+ 1 2) 3
# We operate
# Now the list of arguments is 3 3
# We output 3 3
```

Maybe now you already have a better sense of challenge 1?
If we end with a list of arguments, what can we add to consume those arguments?

## Challenge 1

**Write a program that adds 3 numbers**.

### C1 Solution

```uiua
++
```

**Why?**

Take for example

```uiua
+ 1 2 3
# output: 3 3
```

Since the output is a list of arguments, we should add one more function to
consume those.

```uiua
+ + 1 2 3

# after + 1 2 runs
+ 3 3

# final output: 6
```

## Challenge 2

**Write a program that divides the first number by the second**.

### C2 Solution

```uiua
˜÷
```

**Why?**

Looking at `div a b`, it divides `b` by `a`.
Take for example

```uiua
÷ 5 50
# output: 10
```

Normally, if wanted to divide 5 by 50 instead, we would just write

```uiua
÷ 50 5
# output: 0.1
```

However, we have no control over the argument list in the tests so this is not
an option. What we do control is our function. Let's control it with the function
modifier `backward` which swaps arguments.
Remember, a modifier to a function is to its left.

To explain this visually, let's bind the function `backward add` to `F`.
Don't worry, binding will be explained later but for now you can
try `F = backward add`.

```uiua
F ← ˜÷
 
# Now imagine these are the test cases
# You have no control over the order of inputs here
# But your back modifier takes care of that for div
F 5 50
F 50 5
F 91 13

# Outputs:
# 0.1
# 10
# 7
```

## Challenge 3

**Write a program that subtracts the second number from the first then squares
the result**.

### C3 Solution

There are multiple ways to achieve this. I'll show how I solved this originally.
My first instinct was to raise the result to the power of 2,
`pow 2 back sub`

```uiua
ⁿ2˜-
```

Here is the intended solution, `self mul back sub`

```uiua
˙×˜-
```

**Why?**

The first part of both solutions is to swap the order of arguments to the `sub` function.
Similarly to challenge 2, this uses the `back` modifier.

Let's look at `pow 2 backward sub` first.
The power function has not been introduced but when asked to square a number
I went to the documentation and searched for `square` and `power`. I found the latter.

Let's imagine we have the inputs `8 2`

Remember reading from right to left.
The chain of evaluation is as follows

```uiua
ⁿ2˜- 8 2

# ˜- 8 2 evaluates to 6
ⁿ2 6

# 6² = 36
# output: 36
```

Now, the intended solution is interesting and for me it was an early indicator to
some of the cool ways Uiua functions. So what does `self` do?

```uiua
˙ⁿ 3
˙+ 5
˙× 9

# Outputs:
# 27
# 10
# 81
```

According to the Uiua documentation, self makes it so a function is called
with the same array as all arguments to a function. But hold on, is a number an array?
**Yes!** If you skip ahead to the [Types](https://www.uiua.org/tutorial/Types)
section of the documentation, then the first line states:

>Every value in Uiua is an array

So, to square a number you can do `self mul <num>`

```uiua
˙× 5
# output: 25

˙× 10
# output: 100
```

## Challenge 4

**Write a program that adds the first number to the square root of the second**.

### C4 Solution

```uiua
+⊙√
```

**Why?**

Let's look at `dip`. It's a function modifier that makes a function skip
the first argument. For example

```uiua
⊙+ 1 2 3
# skips 1, adds 2 and 3
#output: 1 5

⊙˙× 2 4
# We dip so 2 is skipped
# We self so 4 is used for all arguments to mul
# We've essentially done 2 4x4
# output: 2 16
```

Regarding the solution, for an input `a b` we want to take the square root of `b`
and then we want to add together `a` and `sqrt(b)`.
The `add` function consumes both `a` and `b` so we can't start with `add a b`.
Then, `sqrt a b` targets `a` which is not what we want either.
However, observe what happens when we do `dip sqrt a b`

```uiua
⊙√ 16 25
# output: 16 5
```

So at that point we have `a sqrt(b)` which is exactly what we want to `add`.
Therefore the whole solution becomes `add dip sqrt`.
