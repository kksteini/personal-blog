+++
title = "More Array Manipulation"
date = 2026-03-09
weight = 11

[extra]
doclink = "https://www.uiua.org/tutorial/More Array Manipulation"
showtoc = true
+++

## Challenge 1

**Write a program that adds the first argument list to each row of the second argument matrix.**

### C1 Solution

```uiua
+¤
```

**Why?**

Let's start with the example, `1_2_3 [4_5_6 7_8_9]`.
These are two arguments, what are their shapes?

```uiua
    △ 1_2_3
[3]
    △ [4_5_6 7_8_9]
[2 3]
```

And if we add them together, do these shapes work?

```uiua
    + 1_2_3 [4_5_6 7_8_9]
Error: Shapes [3] and [2 × 3] are not compatible
```

If you read the chapter documentation carefully, and the
[fix doc](https://www.uiua.org/docs/fix), then a rule seems to emerge.
Pay special attention to the following:

> There is an exception to this rule. If one of the arrays has exactly
> one row, that array will be repeated for each row of the other array.
> This includes scalars.
> Uiua.org | Tutorial on More Array Manipulation

and

> ¤(fix) can also be used with pervasive dyadic functions.
> Uiua.org | Fix documentation

We can see that for pervasive dyadic functions that operate on an argument of
shape [A x B], you can supply [1 x B] such that the single row `B`
operates on all `A` rows of size `B`.

*Refreshers if you need them:*

* [Previous chapter on 'pervasive'](https://www.uiua.org/tutorial/Arrays#pervasion)
* [Previous chapter on 'monadic/dyadic'](https://www.uiua.org/tutorial/Math%20and%20Comparison#adicity)

We had issues with adding together shapes `[3]` and `[2 x 3]` but we just
learned that we should have no problem with adding `[1 x 3]` and `[2 x 3]`.
What changes then? To change a shape from `[3]` to `[1 3]` we capture that argument
into an array (or `fix` it)

```uiua
    △ 1_2_3
[3]
    △ [1_2_3]
[1 3]
    △ ¤1_2_3
[1 3]
```

After the array wrapping changes, we can add `1_2_3` and `[4_5_6 7_8_9]` together.

```uiua
# Wrap the first argument in an array
    + [1_2_3] [4_5_6 7_8_9]
╭─
╷ 5  7  9
  8 10 12
          ╯
# Which is what fix does
    + ¤1_2_3 [4_5_6 7_8_9]
╭─
╷ 5  7  9
  8 10 12
          ╯
```

## Challenge 2

### C2 Solution

My solution

```uiua
≡₁⊂
```

Intended solution

```uiua
≡₁⌞⊂
```
