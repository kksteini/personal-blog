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
We are being asked to do two things.

The first is to prepend a 0 to an array.
This is easily done with `join 0 <your array here>`.

```uiua
    ⊂ 0 [1 2 3]
[0 1 2 3]
```

The second, removing a 0 from the front. Isn't this just what we did but the inverse?
Can't we just put `un` in front of what we did with the output we got?

```uiua
    °⊂ 0 [0 1 2 3]
Error: Cannot unjoin scalar
  at 1:2
```

Hmm, apparently not as simple as just slapping an `un` on there.
What does this mean? This seems to imply that `un join` is the whole that is
acting on `0`, instead of `un join 0` acting on `[0 1 2 3]`.
Well can we be more specific and target `join 0` as a whole?
Let's try:

```uiua
    °(⊂ 0) [0 1 2 3]
[1 2 3]
```

There is a difference in `un join` vs `un (join <something>)`.
We just saw `un (join 0)`, what then happens with `un join`?

```uiua
    °⊂ [0 1 2 3]
[1 2 3]
0
```

These seem to be doing the same thing... but, hang on?
What happens then if `un(join X)` does not find its pattern?

```uiua
    °(⊂ 0) [1 2 3]
Error: 1:3: Pattern match failed: expected 0 but got 1
```

Ah, so that's the catch. With `un join <array>` we can indiscriminately split an
array into its first element and then the rest. With `un (join 0)` we split an array
into its first element, if and only if that element is 0, and then the rest.

But don't just take my word for it.
The documentation is good and you should have a skim through it.
Look at the documentation for [un](https://uiua.org/docs/un) and [join](https://uiua.org/docs/join).
In the `un` documentation, f.x., you should see two versions of `un join`.

What you can read from it is this:

* -`unjoin` splits off the first row off, returns the first row and the rest
* -`un(join X)` splits off X, while keeping the rest,
  if and only if that pattern is found as [X Y Z]

Now, think back on what happens when `un(join 0)` does when its target array
does not have a leading 0.
It errors! That is usable with `try`, is it not?
We can supply the pattern matching function, and if it fails to find a 0,
then we know to tack it on instead.

Try attempts each function, in the order we pass them, and
commits to the first one that does not produce an error.
Therefore, we should supply the pattern matching one first.

```uiua
F ← ⍣(
  °(⊂0) # Try to match 0 and remove from front
| ⊂0    # If above match error, prepend a 0 instead
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

Before we look at Uiua, let's solve this challenge with Python.
It might look something like:

```python
>>> x = "Hello-World. How-are-you-doing?"
>>> s = x.split("-")
>>> [s[0], "-".join(s[1:])]
['Hello', 'World. How-are-you-doing?']
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
Un-formatting a string with the same template string, **a string that still matches**,
should then give us back three arguments.

```uiua
    °$"_ _, ready this _?" "Hi Clifford, ready this Dog Day?"
"Dog Day"
"Clifford"
"Hi"
```

Wowee. Look at `"Dog Day"`. Look at those commas and question marks being
elegantly side-stepped.
Let's cobble something together in Python, quick!!!

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

I'm sure we could do better with Python, this might break. I'm not trying to
make a Pythonic straw-man here, I just simply programmed with what I'd
consider similar mental effort to the Uiua unformatter.

I could use the parse library, work backwards from a `f"..."` template string
or do something clever with regex, But my point is that the contrast is getting
greater. We can write straightforward un-formatting functions in Uiua that get
to be non-trivial to do in Python.
