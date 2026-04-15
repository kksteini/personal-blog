+++
title = "More Array Manipulation"
date = 2026-03-09
weight = 11

[extra]
doclink = "https://www.uiua.org/tutorial/More Array Manipulation"
showtoc = true
+++

## Preamble

### Subscripted rows

*The documentation for this chapter is excellent and you should re-read it, especially
sided rows and operating at different ranks.*

Subscripted rows are a way to decide what rank we work with on the row iterator.

As an exercise, let's create a tiny 3D matrix and play around with it a bit.

```uiua
    X ← °△ 2_2_2
╭─
╷ 0 1  4 5
╷ 2 3  6 7
           ╯
# What's the first element?
    ⊢ X
╭─
╷ 0 1
  2 3
      ╯

# And the last?
    ⊣ X
╭─
╷ 4 5
  6 7
      ╯
```

OK, digging down one level we get a 2D matrix. That makes sense.
Let's dig down one more

```uiua
    ⊢ ⊢ X
[0 1]
    ⊣ ⊣ X
[6 7]
```

Two levels down, we have arrays or more specifically, vectors.
And all the way?

```uiua
    ⊢ ⊢ ⊢ X
0
    ⊢ ⊣ ⊢ X
2

```

But arrays can be any dimensions, can't they?
Instead of using `first` and `last`, you could chain together rows.
Better yet, `rows` has a subscript such that you can act on **scalar, vectors, 3D
matrices, etc**. with subscript **0, 1, 2, etc.** respectively.

Let's prove it.
Take a look at the `?` [args function](https://uiua.org/docs/args).
It shows us the current argument list.
With it, we can see what a subscripted row passes to its function.
Let's try `rows,1`

```uiua
# Reminder, X is `un shape 2_2_2`
    X
╭─
╷ 0 1  4 5
╷ 2 3  6 7
           ╯

    ≡₁(∘?) X
┌╴? 1:5
│╴╴╴╶╶╶
├╴[0 1] <<-wow a vector
└╴╴╴╴╴╴
┌╴? 1:5
│╴╴╴╶╶╶
├╴[2 3] <<-and another
└╴╴╴╴╴╴
┌╴? 1:5
│╴╴╴╶╶╶
├╴[4 5]
└╴╴╴╴╴╴
┌╴? 1:5
│╴╴╴╶╶╶
├╴[6 7]
└╴╴╴╴╴╴
```

The `?` args function shows us that at each iteration to the function
of `rows,1` it received a vector.
I urge you to try yourself with `rows,0`, `rows,2` and `rows,3`, heck, even `rows,10`.

Anyway, since `rows,1` gave us the four vectors of `X`,
can you then predict what `/+` would do within `rows,1` on `X`?

```uiua
    ≡₁/+ X
╭─
╷ 1  5
  9 13
       ╯
```

## Challenge 1

**Write a program that adds the first argument list to each row of the
second argument matrix.**

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
[fix doc](https://www.uiua.org/docs/fix), then a rule emerges.
Pay special attention to the following:

> There is an exception to this rule. If one of the arrays has exactly
> one row, that array will be repeated for each row of the other array.
> This includes scalars.
>
> Uiua.org | Tutorial on More Array Manipulation

and

> ¤(fix) can also be used with pervasive dyadic functions.
>
> Uiua.org | Fix documentation

We can see that for pervasive dyadic functions that operate on an argument of
shape `[A x B]`, you can supply `[1 x B]` such that the single row `B`
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

After fixing, we can add `1_2_3` and `[4_5_6 7_8_9]` together.

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

**Write a program that joins the first argument to each list in the second argument.**

### C2 Solution

My solution

```uiua
≡₁⊂
```

Intended solution

```uiua
≡₁⌞⊂
```

**Why?**

I must admit that I found this one hard to understand, and I am not sure
I fully get it still. I'll start with my solution and then try to build up
to the intended solution.

*If you don't understand sided rows and ranks, when using subscripts, then I urge
you to re-read the Uiua documentation and maybe have a peek at the preamble.*

We are asked to join to each **list** in the second argument.
The first thing we should know to try in that situation is a
vector subscription on `rows`, that is `rows,1`.

If we try then to simply `join` in that context, then the tests pass.
But, have we solved it according to the specifications? There is an important
second part to consider. Namely **join the first argument**.

I think this may be considered vague but perhaps we are being asked to join the
*entire first argument*.

In the test cases, we have two single elements and a list that need to be joined
and fixing them doesn't change the equation on how they are joined with other lists.

Therefore, we need to consider what happens when the first argument is higher dimensional.
Take for example, these fine 3D matrix specimens

```uiua
    X ← °△ 2_2_2
╭─
╷ 0 1  4 5
╷ 2 3  6 7
           ╯

    Y ← + 100 °△ 2_2_2
╭─
╷ 100 101  104 105
╷ 102 103  106 107
                   ╯
```

What is the difference between my solution and the intended one, when
operating on `X` and `Y`?
If we don't fix `X` then joining together `X Y` with `rows,1` acts
pair-wise on the lists within them. The first list of `X` is joined
with the first list of `Y`, then second to second, third to third and
finally the last ones are joined together. We end up with a lovely
`2_2_4` shape.

```uiua
    ≡₁⊂ X Y
╭─
╷ 0 1 100 101  4 5 104 105
╷ 2 3 102 103  6 7 106 107
                           ╯

# And what does the first vector look like?
    ⊢⊢≡₁⊂ X Y
[0 1 100 101]
```

But fixing the 2D array, `X` before joining to `Y` is a different beast entirely.
The resulting shape is `2_2_3_2_2`.

```uiua
    ≡₁⌞⊂ X Y
╭─
╷ 0 1  4 5  100 101   0 1  4 5  104 105
╷ 2 3  6 7  100 101   2 3  6 7  104 105
╷
╷ 0 1  4 5  102 103   0 1  4 5  106 107
  2 3  6 7  102 103   2 3  6 7  106 107
                                        ╯

# And what does the first vector look like?
    ⊡0_0_0_0 ≡₁⌞⊂ X Y
[0 1]
```

Hang on, isn't that peculiar? Not really.
The first argument `X` is indeed a 3D matrix and we should try out the first
join manually. What would a singular join look like?
Well, it should look like a join of the whole `X` to the first vector of `Y`

```uiua
# Recall that X is `unshape 2_2_2`
# and the first vector of Y is 100_101
    ⊂ (°△ 2_2_2) 100_101

╭─
╷ 0 1  4 5  100 101
╷ 2 3  6 7  100 101
                    ╯
```

and the shape is

```uiua
    △ ⊂ (°△ 2_2_2) 100_101
[3 2 2]
```

which looks to be three 2x2 matrices.
What do they look like?

```uiua
    ⊃(⊡0|⊡1|⊡2) ⊂ (°△ 2_2_2) 100_101
╭─
╷ 100 101
  100 101
          ╯
╭─
╷ 4 5
  6 7
      ╯
╭─
╷ 0 1
  2 3
      ╯
```

And that does make sense. Think of the following line from the
[join docs](https://uiua.org/docs/join):
>If the arrays have a rank difference of 2 or more, then the array with the
>smaller rank will be repeated as rows to match the rank of the other.

We see that `100_101` is repeated until it can be joined as a 2D array to the
list of 2D arrays that is `X`.
