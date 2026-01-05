+++
title = "Introduction"
date = 2025-12-31
weight = 0
[extra]
doclink = "https://www.uiua.org/tutorial/Introduction"
+++

## What is this?

These are unofficial companion pages for learning the array based programming
language uiua. I'm doing this for myself but I'm hoping it can help others too.

I will go through each chapter of the official documentation where I
solve and explain the challenges as best as I can.

If you spot any errors, mistakes or misconceptions then don't hesitate to send
in corrections to [<uiuachallenges@kurte.is>](uiuachallenges@kurte.is). They are
very welcome.

### Who is it for?

This is intended for people who have a hard time with the documentation challenges.
I think the uiua documentation is exemplary, and I will be linking
it in each chapter, but I did struggle a lot going through each chapter.
Sometimes I need things dumbed down and when going through the challenges myself
it didn't help that I had no prior experience with array based languages.

For the reader, I assume no prior understanding of array based languages nor
uiua itself.

I would **always recommend reading through the official uiua tutorial**, trying
the challenges and only coming back here if there is something you don't understand.

## What is uiua anyway?

> Uiua (wee-wuh) is a general purpose array-oriented programming language with
> a focus on simplicity, beauty, and tacit code.
>
> uiua.org

### Uiua looks like this

```uiua
⍥◡+9∩1
```

Wowee, that is a confusing series of glyphs.
Do not worry if this looks like garbled nonsense, this will actually become
pretty readable once you engage with it enough.

This example computes and returns
the first 9 terms of the Fibonacci sequence. I think it's pretty neat how
concise this is.

**Informally**, each glyph corresponds to an action or a modifier to an action.
Actions operate on array inputs where as modifiers operate on an action.

#### But how do I type these glyphs?

I recommend the [uiua pad](https://www.uiua.org/pad)

You should go there, write `repeat below add 9 both 1` and then press **run**
in the lower right corner of the pad. It should format to be the same as the
example above and the output the Fibonacci sequence.

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
On the top of every page I link to the relevant uiua documentation.
Read that first, try the challenges. Then come back
to check your understanding, if necessary.
