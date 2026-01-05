+++
title = "Basic Data Manipulation and Formatting"
date = 2026-01-05
weight = 1

[extra]
doclink = "https://www.uiua.org/tutorial/Basic%20Data%20Manipulation%20and%20Formatting"
+++

## Preamble

In many mentions and external resources on uiua you will read about a
stack or see uiua itself being described as stack based.

In the beginning I liked thinking of uiua as stack based to
help me grapple with the language.
I would think of it like this:

```uiua
+ 1 2 3

# 3 gets pushed onto the stack
# 2 gets pushed onto the stack
# 1 gets pushed onto the stack

# add acts on 1 and 2 on the stack
# 1 and 2 are removed, added together
# and three is now pushed back on the stack

# The stack becomes 3 3
```

The current vision for uiua, to my knowledge as of writing, is that the
stack is to be de-emphasized in favour of arguments and modifiers for
argument manipulation.

We still read the order of operations from right to left.

A point from the documentation that is easy to gloss over:
Operations, such as **add**, have their arguments appear to their left.

Therefore:

```uiua
+ 1 2 3

# We read 3
# We read arguments 1 and 2 with their operand +
#   that is to say (+ 1 2) 3
# We operate
# Now the list of arguments is 3 3
# We output 3 3
```

Maybe you already have a better sense of challenge 1?
If we end with a list of arguments, what can we add to consume those arguments?

#### Note on challenge inputs

When interacting with the challenges on the website, suppose
you have the input `1 2 3`.
Whatever solution you write consumes this input.

```uiua
<your solution> 1 2 3
```

This is how a test case with inputs `1 2 3` would be run on your solution.

## Challenge 1

**Write a program that adds 3 numbers**.

### Solution

```uiua
++
```

#### Why?

Look back on the preamble. If after

```uiua
+ 1 2 3
```

we end up with

```text
3
3
```

then we should add one more function to consume and operate on this list
of arguments.

```uiua
+ + 1 2 3

# after + 1 2 runs
+ 3 3

# final output: 6
```
