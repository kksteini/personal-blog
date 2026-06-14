+++
title = "Introduction"
date = 2026-04-28
weight = 0
[extra]
doclink = "https://projecteuler.net/"
toc = false

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## What is this?

I'm going to go through some of the Project Euler problems, out of the first 100.
I'm going to be solving them with Uiua.
The target is to have a solution that runs in under a minute, though I will sometimes
optimize further even if we reach that.

**Keep in mind that I'm not an expert.**
I don't really know math and this whole thing is here to trick you into
disagreeing with me and then helping me learn by sending in better answers
at [<eulerproblems@anub.is>](eulerproblems@anub.is). I welcome discussion of course.

## Who is it for?

I have two goals in mind for these posts.

- Teach Uiua
- Teach problem solving and incremental approaches

Every post builds a foundation for solving these problems
and depending on your familiarity with maths and Uiua, these
might feel slow.

The target audience is myself some 6 months ago before I started this series.
My self assessment at that time was:

- I know very little
- I need slow, methodical and careful explanations
- I need simple before I understand complicated
- I don't have a strong mathematical foundation

## What should you do?

I will be linking to the problems at the top of each section. I urge you to try
for yourself and check back here for hints if you get stuck. I will also
aim to have further reading, if applicable, for these problems.

The guidelines you should adhere to are:

- Have fun
- Learn something new
- Forgive yourself (math is hard)

## On the code

I show Uiua code as I interact with it in the repl.
Sometimes I will show the plaintext before the formatter runs.
It will look like this:

```uiua
    by fork mod,3 mod,5 range,1 9
    ⊸⊃◿₃◿₅ ⇡₁9
[1 2 3 4 5 6 7 8 9]
[1 2 3 4 0 1 2 3 4]
[1 2 0 1 2 0 1 2 0]
```

## Hang on, isn't this illegal?

If we keep to the exception for the first 100 problems, then this is legal
according to Project Euler. In the **About** section the following is stated

>However, the rule about sharing solutions outside of Project Euler does not
>apply to the first one-hundred problems, as long as any discussion clearly aims
>to instruct methods, not just provide answers, and does not directly threaten
>to undermine the enjoyment of solving later problems. Problems 1 to 100 provide
>a wealth of helpful introductory teaching material and if you are able to
>respect our requirements, then we give permission for those problems and their
>solutions to be discussed elsewhere.

## On Uiua Syntax highlighting

Uiua is very cool and will syntax highlight macros and bound functions
differently depending on their context.

Monadic functions are yellow, function modifiers are yellow
and dyadic are blue, literals are red.

> I'm colour blind, these might be green, purple and orange.
> ¯\_(ツ)_/¯

I am using Zola to generate this site and I've chosen to sacrifice
bound function and macro accuracy in favour of having an easier time writing
code.

Zola utilizes Giallo for syntax highlighting which, as of writing, does not
support Uiua so I've clobbered together [this horror](https://github.com/kksteini/personal-blog/blob/main/uiua-syntax-highlighting/uiua.grammar.json).
