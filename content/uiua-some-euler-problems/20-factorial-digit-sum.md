+++
title = "20 - Factorial Digit Sum"
date = 2026-07-09
weight = 20
[extra]
doclink = "https://projecteuler.net/problem=20"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "bigint"]
+++

## Problem

$n!$ means $n \times (n - 1) \times \cdots \times 3 \times 2 \times 1$.
For example, $10! = 10 \times 9 \times \cdots \times 3 \times 2 \times 1 = 3628800$,
and the sum of the digits in the number $10!$ is $3 + 6 + 2 + 8 + 8 + 0 + 0 = 27$.
Find the sum of the digits in the number $100!$

## Module time

In our [previous BigInt chapters](/tags/bigint) we've defined the following.

```uiua
FromString ← ≡⋕⇌
ToString   ← /$"__"⇌
AddNotFin  ← /↥ >9
RemZer     ← ⨬(∘|↘¯1)=0⊸⊣
BigAdd     ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)
```

In the introduction for [chapter 16](@/uiua-some-euler-problems/16-power-digit-sum.md#naive-bigint),
for example, you can read about the derivation of the functions above.

I think it's time to store this in a module and build on it.

> Please take a look at [the module tutorial](https://www.uiua.org/tutorial/Modules)
> if you're unfamiliar. It's fairly straightforward and you can read through it
> in a short time.

Let's call our module `SBI` for `Simple Big Int`. Since we'll be accessing everything
through the module scope, we can also rename `BigAdd` to `Add`.

```uiua
# SimpleBigInt
┌─╴SBI
  FromString ← ≡⋕⇌
  ToString   ← /$"__"⇌
  AddNotFin  ← /↥ >9
  RemZer     ← ⨬(∘|↘¯1)=0⊸⊣
  Add        ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)
└─╴
```

### What do we need next? - Scale

For an easy factorial, it would be nice if we could easily multiply
together a BigInt and a positive integer, or number.

We'll keep it simple. Let's call this operation `Scale` so that we can more
easily remember that the second argument is a number, not a BigInt.

The easiest and laziest way I can think of, and therefore I'll take that route,
is to duplicate the BigInt as many times as the number input dictates.

So, reshaping for repeats.

```uiua
    ˜↯ SBI~FromString "999" 10
╭─         
╷ 9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
  9 9 9    
        ╯ 
```

And that can be reduced with `Add`.

```uiua
    SBI~ToString /SBI~Add ˜↯ SBI~FromString "999" 10
"9990"
```

That looks correct. $999 \times 10 = 9990$ indeed.
Let's add this then. Let's also document our expected input.
I don't know if there's a standard so let's make up something easy to read.

```uiua
# In our SBI module, we add the lines:
---
# Scale  : ARGUMENTS type:BigInt type:Number
# Returns: BigInt multiplied/scaled by Number
Scale ← /Add˜↯
---
```

### What then? - Factorial

Now that we have a scaling function, factorial should be easier.
We want to initialize a BigInt, `[1]` and then apply a `Scale` to it
for every number in the range $1, 2, \cdots, N$ for input $N.$

A simple solution would be to have a double argument do-loop.
We keep scaling our first argument, a BigInt, and the user supplied
argument drives the loop until it hits `lt 2`; no need to scale by $1.$

That might look like this.

```uiua
--- # In SBI
    Factorial ← ⊙◌⍢(⊙-₁ Scale|>1◌) [1]
---
```

If a do-condition uses all arguments, they get copied over for the
next iteration. That's why popping and `gt1` checking is fine.
In the do-body, we `Scale`, with `by` to keep the arguments.
Then `dip sub,1`, decrements
our scaler. This should be all we need for factorial.

### Module testing

Let's throw in a bunch of tests for our module.
We should probably test the formatter, basic addition, big addition,
some edge cases like $99999...+1.$

To do this, we can set up a special `---test` module.
When we interact with this file with `uiua test` it should trigger.

```uiua
┌─╴test
  ˙⍤ ≍ [1 2 3] SBI~FromString "321"
  ˙⍤ ¬≍ [1 2 3] SBI~FromString "123"
  ˙⍤ ≍ "2" SBI~ToString SBI~Add SBI~FromString "1" SBI~FromString "1"
  ˙⍤ ≍ "81512091512039826153948215773282" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ¬ ≍ "81512091512039826153948215773281" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ≍ "100000000000000" SBI~ToString SBI~Add SBI~FromString "99999999999999" SBI~FromString "1"
  ˙⍤ ≍ "9999" SBI~ToString SBI~Scale SBI~FromString "1111" 9
  ˙⍤ ≍ "29668209657543473678132643" SBI~ToString SBI~Scale SBI~FromString "125182319230141239148239" 237
  ˙⍤ ≍ "265252859812191058636308480000000" SBI~ToString SBI~Factorial 30
└─╴
```

And invoking:

```bash
❯ uiua test
Testing ./bigint.ua:
All 9 tests passed
```

## Solution

Now we run our `Factorial 100` function without converting with `ToString`.
Our BigInt representation is a reverse list of digits that we simply add up with `reduce add`.

With our module file handy we simply do:

```uiua
    /+ SBI~Factorial 100
648
```

### How fast?

```uiua
  ⊙◌⍜now(/+ SBI~Factorial 100)
0.033660173416137695  
```

Nice! Well under a second.
Keep in mind that this is a very simple implementation and isn't
winning any medals soon.

The sum of digits for factorial 1000 runs in roughly 11 seconds in Uiua.
However, this nonsense is near instant, timed at 0.04 seconds, in Ruby.

```ruby
puts (1..1000).reduce(:*).to_s.chars.map(&:to_i).sum
```

## Appendix

The module file, along with the solution, so far.

In the [pad](https://uiua.org/pad?src=0_19_0-dev_4__eJzFVDtPG0EQ7u9XjI4UfgizM3t33kUKEkghoogLjjRBCBl8Qif5Qcy5QHKREMmBi5FSGBkimrykRLLkJgVSOqfkX8wvie4RGwNJnCpb3O3dfPt93-zO7By4fm2_6q34e2v1wOBel3sv-Oybu7JmAKw2GzU3aPr1PeDOW-CT9_zmjF93DYCNRhqAOLTwwNzeNpPQcqVSagSrfj0NceczLGkDYN2rPfOaEI2Y7ssgw8fnbe6cj4aYfSg4vOLwY8IQo1Jgso5PP2TykAcOX2W48300xPaP_miIIsvh1ZJuj2WzwIN3IkIef81cX3J4JLKGATAH7m656gEswvL646dPHpU2XAgO973FJPtkXmrVdrxmDF_3glazfrAIabzWqgb-ftX3KgsHEVMFdg5hjE_I44yXK5XrS-4ME9XV8m7QaPrl6j_qRkZThPe8Va5C0EjVIJdO5hFyUCgUIAcSckCQAyxEB_dLMtno8IL73Wj_OLyY56OXwOFVbLe9BAjc72ZhE7cM7vWS05_UQeAdBAbA9QWffgI-OYVNBAK5Be7KWuFGeZiS0BwDR4M_QZHkBBoBTTJj0Limoo-oBu6sNO_5NU2l0EYSOn5KrchBW2pLEdrFoiQ1q9ItmuitFUlLkJYW2voeIyjIQrIUkpJ6KsfRYCZv-D-8xcZQTI0Zfeip8fejmaCmqN24b-5aRjQhujVu1ol2HEVCO3bRtqRVlE5RoSTHkrPzko2KJGqSAi0kqdFSJLUJJIu31BybbFK2VkioUdjKkY4UylK_36dJ40lxo5-MhfytMAph_ATdls4U).
> Note. The module syntax may have changed between 0.18 and 0.19

```uiua
# SimpleBigInt
┌─╴SBI
  FromString ← ≡⋕⇌
  ToString   ← /$"__"⇌
  AddNotFin  ← /↥ >9
  RemZer     ← ⨬(∘|↘¯1)=0⊸⊣
  Add        ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)

  # Scale  : ARGUMENTS type:BigInt type:Number
  # Returns: BigInt multiplied/scaled by Number
  Scale ← /Add˜↯

  # Factorial: ARGUMENTS type:BigInt type:Number
  # Returns  : BigInt equal to Number * Number-1 * ... * 3 * 2 * 1.
  Factorial ← ⊙◌⍢(⊙-₁ ⊸Scale|> 1 ◌) [1]
└─╴
┌─╴test
  ˙⍤ ≍ [1 2 3] SBI~FromString "321"
  ˙⍤ ¬≍ [1 2 3] SBI~FromString "123"
  ˙⍤ ≍ "2" SBI~ToString SBI~Add SBI~FromString "1" SBI~FromString "1"
  ˙⍤ ≍ "81512091512039826153948215773282" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ¬ ≍ "81512091512039826153948215773281" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ≍ "100000000000000" SBI~ToString SBI~Add SBI~FromString "99999999999999" SBI~FromString "1"
  ˙⍤ ≍ "9999" SBI~ToString SBI~Scale SBI~FromString "1111" 9
  ˙⍤ ≍ "29668209657543473678132643" SBI~ToString SBI~Scale SBI~FromString "125182319230141239148239" 237
  ˙⍤ ≍ "265252859812191058636308480000000" SBI~ToString SBI~Factorial 30
└─╴

/+ SBI~Factorial 1000
```
