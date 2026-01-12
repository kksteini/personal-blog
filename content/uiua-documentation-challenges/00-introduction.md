+++
title = "Introduction"
date = 2025-12-31
weight = 0
[extra]
doclink = "https://www.uiua.org/tutorial/Introduction"
showtoc = false
+++

## What is this?

These are unofficial companion pages for learning the array based programming
language Uiua. I'm doing this for myself but I'm hoping it can help others too.

I will be going through the official documentation, chapter by chapter,
solving and explaining the challenges as best as I can.

If you spot any errors, mistakes or misconceptions then don't hesitate to send
in corrections to [<uiuachallenges@kurte.is>](uiuachallenges@kurte.is). They are
very welcome. Feel free to email improvements as well.

### Who is this for?

This is intended for people who have a hard time with the documentation challenges.
I think the Uiua documentation is exemplary, and I will be linking
it in each chapter, but I did struggle a lot going through the problems.
Personally, I need things dumbed down quite a bit and it didn't help
that I had no prior experience with array based languages.

For the reader, I assume no experience with array languages nor
of Uiua. I **do** however assume that you will **read through each official Uiua
tutorial chapter**, try the challenges and then come back here if there is something
you don't understand.

## What is Uiua anyway?

> Uiua (wee-wuh) is a general purpose array-oriented programming language with
> a focus on simplicity, beauty, and tacit code.
>
> uiua.org

### Uiua looks like this

```uiua
⍥◡+9∩1
```

Wowee, that is a confusing series of glyphs, yet they compute the first 9
terms of the Fibonacci sequence. Do not worry if this looks like garbled
nonsense, this will become readable once you engage with it enough.

### But what about typing these glyphs?

When writing Uiua you don't have to remember unicode sequences set up a
keyboard layer for all these glyphs. Nobody is stopping you though.

Instead, when using the Uiua repl or the pad, certain keywords will be formatted
into their corresponding glyphs. I recommend the [uiua pad](https://www.uiua.org/pad).

#### Exercise 1

In the pad, write `repeat below add 9 both 1` and then run your program.
It should format to be the same as the main example above and then output the
Fibonacci sequence.

```text
repeat below add 9 both 1
```

becomes

```uiua
⍥◡+9∩1
```

which outputs

```text
[1 1 2 3 5 8 13 21 34]
```

## What's next?

I recommend you go to the next chapter.
On the top of every page I link to the relevant Uiua documentation.
Read that first, try the challenges. Then come back
to check your understanding, if necessary.
