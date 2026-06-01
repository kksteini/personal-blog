+++
title = "4 - Largest Palindrome Prod"
date = 2026-05-27
weight = 4
[extra]
doclink = "https://projecteuler.net/problem=4"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

A palindromic number reads the same both ways. The largest palindrome made from
the product of two $2$-digit numbers is $9009 = 91 \times 99$.
Find the largest palindrome made from the product of two $3$-digit numbers.

## How to check for palindromicity

Well, we just have to see if an element is the same
backwards and forwards. Let's try `eq by rev` with some tests

```uiua
    IsPalindromic ← = ⊸⇌

    ⍤"Oh no!" IsPalindromic 121
    ⍤"Oh no!" ¬ IsPalindromic 321
Error: Oh no!
  at 4:1
4 | ⍤"Oh no!" ¬ IsPalindromic 321
```

Hmm. `121` is correctly identified as a palindrome but `IsPalindromic` also
thinks `321` is a palindrome. What's going wrong?

```uiua
    ⇌ 321
321
```

Oh. It doesn't make sense to reverse a scalar.
Why should the digits be reversed?
We need some representation of a number that's reversible.
We may want to change a number into a string, reverse the string,
parse the string and compare to the original number.
Yet again we come across the good old, transform-change-revert which
is `under`.

Let's try `under unparse rev`

```uiua
⍜°⋕⇌ 321
123

⍜°⋕⇌ 1337
7331

⍜°⋕⇌ 1000
1
```

Alright. That reverses a number, except if something ends in a zero.
However, we are going to check if the reversals agree and this
can't happen with a number ending in zero since we don't pad with
zeroes normally. Therefore, this will be sufficient.

```uiua
    IsPalindromic ← = ⊸⍜°⋕⇌

    ⍤"Oh no!" IsPalindromic 0
    ⍤"Oh no!" IsPalindromic 5
    ⍤"Oh no!" IsPalindromic 555
    ⍤"Oh no!" IsPalindromic 1221
    ⍤"Oh no!" ¬IsPalindromic 123
    ⍤"Oh no!" ¬IsPalindromic 12
    ⍤"Oh no!" ¬IsPalindromic 10
# In repl: No output means all tests pass
```

Tests are nice and all but let's use this to generate palindromic numbers.
Let's look at the range 50-100 for example.

```uiua
    keep by rows IsPalindromic +50 range 51
    ▽⊸≡IsPalindromic +50⇡51
[55 66 77 88 99]
```

Ah yes, this makes sense.

## Solving with brute force

Now, let's make an array of all products of numbers from 0-999.
We can use the same filter on that result to get palindromes.

We start with the range

```uiua
    ⇡ 1000
[0 1 2 3 4 5 6 7 8 <truncated> 998 999]
```

For each row, we multiply by all numbers from 0-999

```uiua
    ≡(× ⇡1000) ⇡ 1000
╭─
      1000×1000 ℝ
  0-998001 μ249500.25

```

That's hard to visualize so let's do a quick sanity check with 0-3

```uiua
    ≡(× ⇡4) ⇡ 4
╭─
╷ 0 0 0 0
  0 1 2 3
  0 2 4 6
  0 3 6 9
          ╯
```

Yep. That's all them products. However it is in a 2D array.
Let's deshape this so that we get a flat list

```uiua
    ♭≡(× ⇡4) ⇡ 4
[0 0 0 0 0 1 2 3 0 2 4 6 0 3 6 9]
```

And while we're at it, remove duplicates, `dedup`, so that subsequent
calculations down the line are fewer

```uiua
    ◴ ♭≡(× ⇡4) ⇡ 4
[0 1 2 3 4 6 9]
```

Now let's consider the ranges 0-999 again and filter to palindromes

```uiua
    ▽ ⊸≡IsPalindromic ◴ ♭≡(× ⇡1000) ⇡ 1000
[0 1 2 3 4 <truncated> 906609 886688 861168 888888] 
```

And then getting the largest one

```uiua
    /↥ ▽ ⊸≡IsPalindromic ◴ ♭≡(× ⇡1000) ⇡ 1000
906609
```

### How fast?

On my laptop this takes roughly 0.3 seconds according to `perf`.

> The Euler problems' **under-a-minute-rule** is already achieved here.
> Feel free to move on, the rest of this document goes through
> a slow discovery of speeding up the calculations and increasing
> terseness.

I'd argue that this is fast enough, but let's try some other implementations
and compare them.

For now, let's store this whole computation so that we can more easily compare later.
Let's also drop `IsPalindromic` and use its contents, since that is visually shorter.

```uiua
    LargestPalindrome ← /↥▽⊸≡(=⊸⍜°⋕⇌)◴♭≡(×⇡1000)⇡1000

    perf(LargestPalindrome)
    ⊙◌⍜now(LargestPalindrome)
0.000001430511474609375
```

That's too fast? Ah, yes. The binding precomputes the value and stores it in LargestPalindrome.
We can prevent this by wrapping our binding definition in parentheses

```uiua
    LargestPalindrome ← (/↥▽⊸≡(=⊸⍜°⋕⇌)◴♭≡(×⇡1000)⇡1000)
    ⊙◌⍜now(LargestPalindrome)
0.22612762451171875
```

now the function is run when LargestPalindrome is invoked.

## Finding some built-ins

Often we can get better results by finding specialty built-ins.
They are optimized for their specific tasks after all.

Recall what we did earlier to multiply all elements with one another
from two equal ranges.

```uiua
    ≡(× ⇡4)⇡4
╭─
╷ 0 0 0 0
  0 1 2 3
  0 2 4 6
  0 3 6 9
          ╯
```

Surely, there's a built-in that operates with two arrays in this way?
Well, there is [table](https://uiua.org/docs/table).

```uiua
    table mul range4 range4
    ⊞× ⇡4 ⇡4
╭─
╷ 0 0 0 0
  0 1 2 3
  0 2 4 6
  0 3 6 9
          ╯
```

And couldn't we modify `table` with `self` to skip making two ranges?

```uiua
    self table mul range4
    ˙⊞×⇡4
╭─
╷ 0 0 0 0
  0 1 2 3
  0 2 4 6
  0 3 6 9
          ╯
```

Let's take this as a checkpoint and make a new function that calculates the
largest product palindrome

```uiua
    LargestPalindrome′ ← (/↥▽⊸≡(=⊸⍜°⋕⇌)◴♭˙⊞×⇡1000)
```

### Is it faster?

Let's compare the performance between the original and
our checkpoint.
I've created a macro that runs a function 100 times and shows
the average runtime.
See [gauntlet in appendix](@/uiua-some-euler-problems/04-largest-palindrome-product.md#the-gauntlet).
If we run them a 100 times, how do they compare?

```uiua
    Gauntlet!LargestPalindrome′
0.2342543911933899
    Gauntlet!LargestPalindrome
0.23686788558959962
```

Well. The average differs by ~0.002 seconds.
This is likely not significant and might flip based on random variations.

It is more beautiful though.

```uiua
˙⊞×⇡1000
vs
≡(×⇡1000)⇡1000
```

## Reducing calculations

Let's think about what we are calculating and try to chisel away
some unnecessary calculations.

### Lossy transformation

Isn't `under` an overkill for the palindromic check?
We don't have to transform back to a number.
Lets just transform the number and see if the resulting string
is palindromic.

```uiua
    IsPalindromic' = match by rev unparse
    IsPalindromic′ ← ≍ ⊸⇌ °⋕

    ≡IsPalindromic′ [0 55 123 32123]
[1 1 0 1]
```

Now we can try injecting this into our previous implementation and see if its
any better

```uiua
    LargestPalindrome″ ← (/↥▽⊸≡(≍ ⊸⇌ °⋕)◴♭˙⊞×⇡1000)
```

and the average of 100 `perf`s comes down to

```uiua
    Gauntlet!LargestPalindrome″
0.1886356520652771
```

That's faster.
Let's run all three again just to make sure.

```uiua
    Gauntlet!LargestPalindrome
0.23670884132385253
    Gauntlet!LargestPalindrome′
0.23418128490447998
    Gauntlet!LargestPalindrome″
0.18808703899383544
```

An improvement for sure.

### A different paradigm

When we use `table`, there are a lot of wasted calculations.
For each $A \times B$ there exists a
calculation for $B \times A$ in our table. What we want are
all combinations of two elements in the array `range 1000`.

Enter [tuples](https://uiua.org/docs/tuple).

> Get permutations or combinations of an array
>
> ≠ will give all permutations of rows from the array.
>
> < and > will give all unique combinations of rows from the array.
>
> ≤ and ≥ will include values that are the same.

Let's try it.

```uiua
    ⧅≥2 +1⇡4
╭─
╷ 1 1
  2 1
  2 2
  3 1
  3 2
  3 3
  4 1
  4 2
  4 3
  4 4
      ╯
```

Cool. Though, it would be great if it were two rows of numbers so that
we could use `reduce mul` to multiply. Isn't that just `trans` though?

```uiua
    ⍉ ⧅≥2 +1⇡4
╭─
╷ 1 2 2 3 3 3 4 4 4 4
  1 1 2 1 2 3 1 2 3 4
                      ╯
```

And reducing these by multiplication should render an array

```uiua
    /×⍉ ⧅≥2 +1⇡4
[1 2 4 3 6 9 4 8 12 16]
```

At this point we can repeat the same spiel as we did with the other implementations.

```uiua
    /↥▽ ⊸≡(≍⊸⇌°⋕)◴/×⍉ ⧅≥2⇡1000
906609
```

binding this and doing the gauntlet of a 100 runs

```uiua
    LargestPalindrome‴ ← (/↥▽ ⊸≡(≍⊸⇌°⋕)◴/×⍉ ⧅≥2⇡1000)
    Gauntlet!LargestPalindrome‴
0.17056868791580201
```

Nice. Somewhat faster.

### Knowing how to read

We were asked for a palindrome made out of two **three digit** numbers.
But surely that can't be that bad?

```uiua
    ⧻ ⧅≥ 2 + 100 ⇡ 900
405450
    ⧻ ⧅≥ 2 ⇡1000
500500
```

Oh. Well, it reduces the search space roughly 20 percent. What does this do?
Let's quickly redefine all functions and run the 100 round gauntlet on all of them

```uiua
    LargestPalindrome ← (/↥▽⊸≡(=⊸⍜°⋕⇌)◴♭≡(×+100⇡900)+100⇡900)
    LargestPalindrome′ ← (/↥▽⊸≡(=⊸⍜°⋕⇌)◴♭˙⊞×+100⇡900)
    LargestPalindrome″ ← (/↥▽⊸≡(≍ ⊸⇌ °⋕)◴♭˙⊞×+100⇡900)
    LargestPalindrome‴ ← (/↥▽ ⊸≡(≍⊸⇌°⋕)◴/×⍉ ⧅≥2+100⇡900)

    Gauntlet!LargestPalindrome
0.20527817964553832
    Gauntlet!LargestPalindrome′
0.20321281433105468
    Gauntlet!LargestPalindrome″
0.16061073541641235
    Gauntlet!LargestPalindrome‴
0.15284034490585327
```

An improvement, but only so much.

### Early exit

What if

* -we get all combinations
* -multiply them together
* -sort and dedup
* -work our way backwards through the list until we hit a palindrome
* -return the palindrome

This should reduce the amount of palindromic checks by a whole lot.
Let's set up a `do` loop for this.
It would make sense for our condition check to ask whether the
largest element is palindromic. We drop it and continue if not, otherwise we stop.

```uiua
    Docondition ← ≍ ⊸⇌ °⋕
    Dobody ← ↘¯1
```

If we now set up a do loop like `do(Dobody|not Docondition last)` then
what should happen is the following.

* -We check the last element of an array
* -If it is not palindromic we drop it
* * +The array shrinks
* -If it is palindromic we stop
* * +The last element caused the stop so when we quit,
this will be the largest palindrome

We should now have a smaller array where the last element is palindromic.
We therefore end up with something like

```uiua
  ⊣⍢(Dobody|¬Docondition⊣) X
```

where `X` is a sorted array of palindrome candidates.

Let's bind this, evaluate the result and then do the performance gauntlet

```uiua
    LargestPalindrome‴″ ← (⊣⍢(Dobody|¬Docondition⊣) ⍆ ◴ /× ⍉ ⧅≥ 2 + 100 ⇡ 900)
    Gauntlet!LargestPalindrome‴″
0.00…013113021850585939
```

Uh... that is faster. Suspiciously so.
Let's sanity check then that this is correct and that it is this fast

```uiua
    LargestPalindrome‴″
906609
    ⊙◌⍜now(LargestPalindrome‴″)
0.00000286102294921875
```

Oh, the binding might be computing the result and storing it despite the
parentheses. Let's run this one manually and see if it is different.

```uiua
    ⊙◌⍜now(⊣⍢(Dobody|¬Docondition⊣)⍆◴/×⍉⧅≥2+100⇡900)
0.020819664001464844

    ÷₁₀₀ /+ ⍥₁₀₀(⊙◌⍜now(⊣⍢(Dobody|¬Docondition⊣)⍆◴/×⍉⧅≥2+100⇡900))
0.02297837257385254
```

That seems more like it.
Not quite 2 microseconds but it's still much faster than our previous attempts.
At 23 milliseconds I think it's time to stop, except, there is one thing.
Take a look at the [Uiua optimizations documentation](https://www.uiua.org/docs/optimizations).

>Sortedness flags are used to improve the performance of:
>
> * -\<truncated yada yada\>
>
> * -◴ deduplicate and ⊛ classify

With this in mind, let's swap `sort` and `dedup` to see if we can take
advantage of it.

```uiua
    ÷₁₀₀ /+ ⍥₁₀₀(⊙◌⍜now(⊣⍢(Dobody|¬Docondition⊣)◴⍆/×⍉⧅≥2+100⇡900))
0.012863028049468993
```

That's ~13 milliseconds wowee! I think we can be happy with that.

### Was all that effort worth it?

I think it is good, every now and then, to try to optimize our code
even if our first attempt is sub second. It's healthy to approach
the problem from as many angles as one can and see what happens.

Another reason is engaging with Uiua.
Helping with learning Uiua is a goal here, so exploring different
methods is useful, I think.
Personally, when researching this problem, I learned more about `table` and `tuples`,
something I don't use enough.

### Can we go even faster? Even terser?

Yeah, likely. Right now I can't think of anything.
This here might be an open slot for you to submit into.
I would be very happy to showcase a significantly faster
solution. Don't be a stranger, [eulerproblems@anub.is](eulerproblems@anub.is)

## Appendix

### The Gauntlet

I wanted something that runs a 100 performance checks and
calculates the average. This macro is what I came up with.

```uiua
# Binding helper to make sure function isn't precomputed
    GauntletHelper! = (perf(^))
    GauntletHelper! ← (⊙◌⍜now(^))

# Run a 100 times and acquire the average runtime
    Gauntlet! = div,100 /add repeat,100(GauntletHelper!^)
    Gauntlet! ← ÷₁₀₀ /+ ⍥₁₀₀(GauntletHelper!^)

    Gauntlet!LargestPalindrome
0.23597447633743285
```
