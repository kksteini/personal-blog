+++
title = "16 - Power Digit Sum"
date = 2026-07-03
weight = 16
[extra]
doclink = "https://projecteuler.net/problem=16"
pad="https://uiua.org/pad?src=0_19_0-dev_4__eJw9kD1LJEEQhvP-FS9M4AzLODMXCAonaCCYGHhGBgetU7tbMNMzdHUrwgbnCosMCGZ-YKQIHgibCpfthf6L_iUyfkFFxfM-VbwRtrx1Y7IoyWmuBEK0piJo4w-WWTLPXqfS1JSSr8imrW0OKqolK1bStjkmm5Y8YpeKrzMVoSchXLcVxUbzESXY5NG2cShpyIYdN0bURlnuNG6LDcLsElmYPWJ9Ve1SvU8WwPs2PD3H4fx6EmbXi3mR_MxD9xK6B7XJo42y_KI-MuHiPh5ggNCdxWH2bzEvJv-vFvMiT0L3sr46-b6XIDzf5j15_jd-vQvdNE-UitAbC7ATqobQKPI8h-OaZFlF2BtrtyRwY4LomqAFP373iAoXj2F6GqZ_Pub15vO5onf-8jXYwbcQNoeExtvPLlQEFlhqLQkZR2Wv1AbaWn2CZoj3SkVlA_UGX3acUg=="
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "bigint"]
+++

## Problem

$2^{15} = 32768$ and the sum of its digits is $3 + 2 + 7 + 6 + 8 = 26$.
What is the sum of the digits of the number $2^{1000}$?

## Foundations

If you've recently read through [chapter 13](uiua-some-euler-problems/13-large-sum.md#naive-bigint)
then you can skip to the [solution](/uiua-some-euler-problems/16-power-digit-sum#solution).
There will be nothing new here.

### IEEE 754 - Double precision

Uiua uses the double precision floating point standard of IEEE 754.
This has the consequence of rounding integers once they get too large.
At around $2^{53}$, or $9007199254740992$ things start breaking down.

Let's try all 1s but with one digit more than that.
We'll enter that into the Uiua repl.

```uiua
    11111111111111111 # our input
11111111111111112     # repl output
```

Yup, that rounds up a little. This problem gets worse
with larger numbers.
What about a 50 digit number?

```uiua
    53503534226472524250874054075591789781264330331690
    53503534226472520000000000000000000000000000000000
```

That sure looks problematic.

#### Further reading

[Double Precision Floating Point - Limitations on Int](https://en.wikipedia.org/wiki/Double-precision_floating-point_format#Precision_limitations_on_integer_values)

### Naive BigInt

BigInts are integers that get arbitrarily large without data loss.
Let's make our own limited BigInt in Uiua.
We know that we're only going to be doing addition so we can simplify by just
focusing on that.

What if we represent BigInt as
an array of digits?
Let's work out what we want.

#### Representation

It makes sense to have a function that transforms a string of digits into
an array of digits.

```uiua
    FromString ← ≡⋕

    FromString "18512831951230"
[1 8 5 1 2 8 3 1 9 5 1 2 3 0]
```

That also means we'd like to bring them back.

```uiua
    ToString  ← /$"__"

    ToString [1 8 5 1 2 8 3 1 9 5 1 2 3 0]
"18512831951230"
```

#### Addition

We can't just mush together two arrays though.
Plain arrays overflow.

```uiua
    + [1 2 3 4] [3 4 5 6]
[4 6 8 10]
```

We need a method, `BigAdd`, that corrects the overflow.

```uiua
    BigAdd [1 2 3 4] [3 4 5 6]
[4 6 9 0]
```

We'd want to detect overflows, `>9` and then do two things based on that.

* Mark overflow with $1$, rotate and add to the next 10s place.
* Mark overflow with $1$, subtract 10.

Here's a step by step.
We'll start by identifying overflows.

```uiua
    ⊸>9 [4 6 8 10]
[4 6 8 10]
[0 0 0 1]
```

We'll rotate the overflow by one so that the next digit is correctly incremented.

```uiua
    ↻1 ⊸>9 [4 6 8 10]
[4 6 8 10]
[0 0 1 0]

# And if added
    + ↻1 ⊸>9 [4 6 8 10]
[4 6 9 10]
```

Now we just need the correction factor.
Instead of correcting right away, we can fork the overflow array with the
rotation and `mul ¯10`.

```uiua
    ⊃(×¯10|↻1) ⊸>9 [4 6 8 10]
[4 6 8 10]
[0 0 1 0]
[¯0 ¯0 ¯0 ¯10]
```

Adding these three together results in a correct BigInt addition.

```uiua
    ++ ⊃(×¯10|↻1) ⊸>9 [4 6 8 10]
[4 6 9 0]
```

#### Edge case - Adding various lengths

The `[4 6 8 10]` array was generated from two equal length arrays.
What happens if we want to add together differing lengths?
What about $1 + 999$?

```uiua
    + [9 9 9] [1]
[10 10 10]
```

Hmm. That's strange, though intended. Recall the tutorial.

>If one of the arrays has exactly one row,
> that array will be repeated for each row of the other array.
> This includes scalars.
>
>Uiua.org | Tutorial on More Array Manipulation

This means that we should expect an error from $999 + 11$ unless the `add`
function has a fill context.

```uiua
    + [9 9 9] [1 1]
Error: Shapes [3] and [2] are not compatible

    ⬚0+ [9 9 9] [1 1]
[10 10 9]
```

Though... isn't that filling in from the left? We want the fill to come in from
the right since `[1 1]` should affect the least significant digits first.

We could combat this by simply reversing the representations. Let's update our definitions.

```uiua
    FromString ← ≡⋕⇌

    FromString "18512831951230"
[0 3 2 1 5 9 1 3 8 2 1 5 8 1]
```

Bringing it back is also a matter of reversal.

```uiua
    ToString ← /$"__"⇌

    ToString [0 3 2 1 5 9 1 3 8 2 1 5 8 1]
"18512831951230"
```

Since we've reversed the notation, we also have to remember to `rotate`
in the other direction as well.

#### Multiple steps needed

Let's take what we've gathered so far and start defining our `BigAdd`.

```uiua
    BigAdd ← ++⊃(×¯10|↻¯1) ⊸>9 ⬚0+

```

Let's add together $1234$ + $3456$ and see if the overflow is handled
such that we get $4690.$

```uiua
    BigAdd FromString "1234" FromString "3456"
[0 9 6 4]

    ToString BigAdd FromString "1234" FromString "3456"
"4690"
```

Alright. But what about something like $1 + 999$?

```uiua
    ToString BigAdd FromString "1" FromString "999"
"9100"
```

We're clearly missing something.
Let's make a function that checks if any digit is over $9.$
This can be a condition for a do loop that keeps correcting the digits until
none are over the threshold. We'll update the `BigAdd` to contain such a loop.

```uiua
    AddNotFin ← /↥ >9
    BigAdd    ← ⍢(++⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0+
```

What does $999 + 1$ result in now?

```uiua
    BigAdd FromString "999" FromString "1"
[1 0 0]
```

Huh. If we pass that to `ToString` we get back `"001"`.
It seems like the $10$s overflow correction was run multiple times
but the last calculation rotated the $1$ such that it wrapped around.
This makes sense though. The result should be 4 digits long
but the longest array supplied is 3. We're simply missing a digit.

What if we just append a $0$, `both(bw join 0)`, to the input arguments so that
overflows have an empty significant digit to go to?
If we're just adding together two numbers, at a time, the worst case
is all $9$s, for both arguments, which still just requires one extra space.

We can then introduce a check on the other side that removes a zero if it is
the most significant position. We can just check the last digit and switch between
`drop ¯1` or `id`.

Our definitions now look like this.

```uiua
    FromString ← ≡⋕⇌
    ToString ← /$"__"⇌
    AddNotFin ← /↥ >9
    RemZer ← ⨬(∘|↘¯1)=0⊸⊣
    BigAdd ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)
```

Let's test $1 + 999$, $999 + 1$ and $1234+3456$ again.

```uiua
    ToString BigAdd FromString "1" FromString "999"
"1000"
    ToString BigAdd FromString "999" FromString "1"
"1000"
    ToString BigAdd FromString "1234" FromString "3456"
"4690"
```

Great. That looks correct.

## Solution

Multiplying by two is the same as adding the number to itself.
Let's try `self BigAdd 2` with a `repeat`.

```uiua
    ToString⍥₁₀˙BigAdd 2
"2048"
    pow 10 2
    ⁿ 10 2
1024
```

Well, off by one. Of course, $2^0=1$, isn't it?
The initial factor should be $1$ then.

```uiua
    repeat,0 self BigAdd 1
    ⍥₀˙BigAdd 1
1
```

Let's then try again, with repeat $1000$ and `reduce sum` on the digits instead
of `ToString`.

```uiua
    reduce add repeat,1000 self BigAdd 1
    /+ ⍥₁₀₀₀˙BigAdd 1
1366
```

### Speed?

Yes, there is speed. 0.006 seconds.
I declare this a success.

```uiua
    ⊙◌⍜now(/+ ⍥₁₀₀₀˙BigAdd 1)
0.006022453308105469
```
