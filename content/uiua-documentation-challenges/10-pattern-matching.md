+++
title = "Pattern Matching"
date = 2026-03-04
weight = 10

[extra]
doclink = "https://www.uiua.org/tutorial/Pattern Matching"
showtoc = true
+++

## Challenge 1

**Write a program that removes a leading 0 from an array of numbers or prepends
a 0 if it is missing.**

### C1 Solution

```uiua
⍣°(⊂0)(⊂0)
```

**Why?**
Let's work through it.
We are being asked to do one of two things.
Let's not focus on why we should be doing them just yet.

The first is to prepend a 0 to an array.
This is easily done with `join 0 <your array here>`.

```uiua
    ⊂ 0 [1 2 3]
[0 1 2 3]
```

Now, isn't removing a 0 from an array just the inverse?
Can't we just put `un` in front of what we did with the output we got?

```uiua
    °⊂ 0 [0 1 2 3]
Error: Cannot unjoin scalar
  at 1:2
```

What does this mean? This seems to imply that `un join` is acting on 0, instead
of `un(join 0)`.

Well, let's try being more specific then

```uiua
    °(⊂ 0) [0 1 2 3]
[1 2 3]
```

Why do we need the parentheses there? Well, `join 0` isn't a function boundary,
or a token if you will. The whole is `join 0 <some array>`
with a `<some result array>`. Therefore `unjoin <some result array>` should
result in `0 <some array>`

```uiua
# Is that what we observe?
# Yes, 0 [1 2 3]
    °⊂ [0 1 2 3]
[1 2 3]
0
```

So what's the difference?
Look at the documentation for [un](https://uiua.org/docs/un) and [join](https://uiua.org/docs/join).
In the `un` documentation you should see two versions of `un join`.

* -`unjoin` splits off the first row off, returns the first row and the rest
* -`un(join X)` splits off X, while keeping the rest,
  if and only if that pattern is found as [X Y Z]

What happens then if `un(join X)` does not find its pattern?

```uiua
    °(⊂ 0) [1 2 3]
Error: 1:3: Pattern match failed: expected 0 but got 1
```

It errors! That is usable with `try`, is it not?
We can supply the pattern matching function, and if it fails to find a 0,
then we know to tack it on instead.
Try attempts each function, in the order we pass them to try, and
commits to the first one that does not produce an error.
Therefore, we supply the pattern matching one first.

```uiua
F ← ⍣(
  °(⊂0) # Try to match 0 and remove from front
| ⊂0    # If match error, prepend a 0 instead
)
```

Let's rewrite it as a one-liner and then try each case.

```uiua
    F ← ⍣°(⊂ 0)(⊂0)

    F [1 2 3]
[0 1 2 3]

    F [0 0 1 2]
[0 1 2]
```

## Challenge 2

**Write a program that splits a string on the first - and returns the two parts.**

### C2 Solution

```uiua
°$"_-_"
```

**Why?**

This is a fun one. I don't think it is too hard to understand but it has a stark
contrast to other non-array languages you might be used to.

The solution is easy enough to replicate with something like Python

```python
>>> x = "Hello-World!"
>>> x.split("-")
['Hello', 'World!']
```

But what is Uiua doing?
Recall [format strings](https://www.uiua.org/tutorial/Modifiers%20and%20Functions#format-strings).
What are their inverses if not just extracting text?

A format string going forwards

```uiua
    $"_ _, ready this _?" "Greetings" "Maxwell" "Caturday"
"Greetings Maxwell, ready this Caturday?"
```

Then going backwards, we should `un` that same format string.
We formatted using `$"_ _, ready this_?` and then gave it three arguments.
Un-formatting a string, **that still matches**, should give us three arguments then.

```uiua
    °$"_ _, ready this _?" "Hi Clifford, ready this Dog Day?"
"Dog Day"
"Clifford"
"Hi"
```

Wowee. Look at `"Dog Day"`. Look at those commas and question marks being
elegantly side-stepped. Here it starts getting difficult for Python to follow.
Let's cobble something together, quick!

```python
>>> def unformat(greeting):
...     y = greeting.split(", ready this ")
...     greeting = y[0].split(" ")[0]
...     name = y[0].split(" ")[1][0:-1]
...     day = y[1][0:-1]
...     return [greeting, name, day]
...
>>> unformat("Hello Possmosis-Jones, ready this Scream Loud Day?")
['Hello', 'Possmosis-Jone', 'Scream Loud Day']
```

I'm sure we could do better with Python, this one might break.
Maybe we could use the parse library, work backwards from a `f"..."` template string
or do something clever with regex.

But here, the contrast is getting greater. We can write straightforward
un-formatting functions in Uiua that get to be quite complex for something like
casual Python to do.
