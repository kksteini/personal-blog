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
I'm going to be solving them with Uiua and occasionally I might throw in a Ruby
or Rust solution.

Keep in mind that I'm not an expert.
I don't really know math and this whole thing is here to trick you into
disagreeing with me and then helping me learn by sending in better answers
at [<eulerproblems@anub.is>](eulerproblems@anub.is). I welcome discussion of course.

## What should I do?

I will be linking to the problems at the top of each section. I urge you to try
for yourself and check back here for hints if you get stuck. I will also
aim to have further reading, if applicable, for these problems.

The guidelines you should adhere to are:

* Have fun
* Learn something new
* Forgive yourself (math is hard)

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
