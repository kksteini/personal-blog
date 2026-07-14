+++
title = "20 - Factorial Digit Sum"
date = 2026-07-09
weight = 20
[extra]
doclink = "https://projecteuler.net/problem=20"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJzFVE1r20AQvetXDHIPtoPsnV1J1hoaSKAuOTSHOL00hGBH21Qg2a4-DgUf2hTcRHWgB4ckJZd-QQsGX3oI9OYe8y_2lxRJjh0naeueugdppXn73tvZmc1BLfLDZ8IHW4QNxw2qSg4arahZcoJy5EQNLWh7QhORK3yt47ebrvCCMiXa08Zu2PadhqvZzp4TakHklZUc1B2v44pVZ2-tFSpy0JeDl_L4e311TQGo-W2vHvpOaw9k7x3Iww_y7bF801cANtuTAKSh8j11Z0fNQiu2vd4Oa05rEpK9L7DMFYAN4T0RPiQjpfs6zMuD067snY5HWLhPZHwh408ZQ4qaALN18uhjfgmWQMav87L3YzzC7s-T8QhJQcYXy7w7lS2AHL4nCfLgW_7yXMb7pKAoADmo7zZcAVCFlY2Hjx89WN-sQ_iiI6rZ7rP5euQ1hZ_CN0QY-a2gCpO4F7mh03EdYZeDhMmG5guY4jPydMcrtn15LnujTLV2lfh_1E2MThDiedRwIWxP1KA4mWgIRSiVSlAEBkWgUAQsJQd3JZklOj6TJ_0kfzI-0-T-K5DxRWq3uwwI8qRfgC3cVuRgkJ3-rA5CEYQKwOWZPPoM8vAIthAosG2or66VrpWHyiiqU-B4-CcoUjaDJkCVqiloWlPJR1IDt1aqd_yap7LQQEp4-mTcoiYajOsWRaNSYdRaVOkGTfLmFmU6oZzpaPA7jCChOlLdQmoxPrfH8XAhb_g_vKXGkMyNBX3wufH3o5mh5qjrad_ctoyoQnJrXK8TbpoWJdw0KobO9AozKxYyaupscV5qoEUZcsoI6kgZR92ijKtAWeWGmmlQg1oGt5AiR2JYJjMZsXTr93maNR4j1_pJKS_dCCMhyi-SGel_"
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

The module file, so far, along with the solution.

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
