+++
title = "21 - Amicable Numbers"
date = 2026-07-10
weight = 21
[extra]
doclink = "https://projecteuler.net/problem=21"
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxtj7tKA0EUhvt5igNpEuJmN5ZCCjEIdgsprGezJ8nA7M46F_tskeiiYJXIdoHYWQraBEHf5DyJTC6ikPq_fP_fgEun7QQ1pGi5kOaMNYDnLukIEzrheGBUhgE6iTootEokZiY87QY8E0OeSAxylyWoTchYA2KtCl8lboVR2pyAK8AqsBMEc-O4RtBKWVAjD4FdssPi_gBo9gS02EAvAlrXtPwEmq-onAI9VEDVB93VRwCgEstFjimMtMoOjIO6fZJ6utAwVFkhMcPcQtMbUpGP_bYxWuBStvyM3YrZM5VTWr5RVdK6_n73-Lg_YOzKnO9PX_A8FSm3uE30tgMfX6gsm2Eb4n7rj_Va2MkA5Qj21rC962Nhmxabr1cfvV8d8VNV96AL_8RfLs1X0I2iKGI_2ueyEg=="
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

Let $d(n)$ be defined as the sum of proper divisors of $n$ (numbers less than
$n$ which divide evenly into $n$). If $d(a) = b$ and $d(b) = a$, where
$a \ne b$, then $a$ and $b$ are an amicable pair and each of $a$ and $b$ are
called amicable numbers.

For example, the proper divisors of $220$ are
$1, 2, 4, 5, 10, 11, 20, 22, 44, 55$ and $110$; therefore $d(220) = 284$.
The proper divisors of $284$ are $1, 2, 4, 71$ and $142$; so $d(284) = 220$.

Evaluate the sum of all the amicable numbers under $10000$.

## Proper divisors

Back in [chapter 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#alternate-proper-divisors)
we had a function for proper divisors.

Let's use it.

```uiua
PD ← ⊚=0◿⊸⇡
```

### Checking for amicability

Now, how do we check if two numbers are amicable using `PD`?
We are given the example that $220$ is an amicable pair with $284.$
Let's see what that looks like.

```uiua
    PD 220
[1 2 4 5 10 11 20 22 44 55 110]
    /+ PD 220
284
```

OK. Summing the divisors of $220$ does yield $284$.
If we apply `PD` again we should get the proper divisors
of $284$, and summing that up should yield $220$ again,
if we've done everything right.

```uiua
    PD /+ PD 220
[1 2 4 71 142]
    /+ PD /+ PD 220
220
```

Yes.
So an amicability test might simply be to run this twice and keep the original
input, for comparison, with `by`.

```uiua
    /+ PD /+ ⊸PD 220
220
220

    =/+ PD /+ ⊸PD 220
1
```

We could clean that up a little with `repeat`. Let's do that and
bind it to `IsAmicable`.

```uiua
    IsAmicable ← =⊸⍥₂(/+ PD)

    ≡IsAmicable [220 284 9 1000]
[1 1 0 0]
```

## Solution

### Straight up crunching it

We have numbers to crunch, so let's get to it.
We will supply our `IsAmicable` function with all elements of the range
$1-10000$ and then ask `where` it is `eq 1`.

```uiua
    ⊚ =1 ≡IsAmicable⇡10000
[0 6 28 220 284 496 1184 1210 2620 2924 5020 5564 6232 6368 8128]
```

Cool. $284$ and $220$ are in there. Let's reduce it and try submitting our answer.

```uiua
    /+ ⊚ =1 ≡IsAmicable⇡10000
40284
```

Hmm. That's not the right answer. Let's scrutinize our results a little bit.
What are $0$ and $6$ doing in there?

```uiua
    PD 6
[1 2 3]
    /+ PD 6
6
    IsAmicable 6
1
```

Ah. The problem states that the amicable pair should be such that
$a \ne b$ but we have an issue here with $6$ and some others possibly.

Well. Let's just change `IsAmicable`. It doesn't have to be pretty.
We'll just `fork` a single and a double pass, and then compare them.
Let's see if that distinguishes between $220$ and $6$ for example.

```uiua
    ⊃(≠/+ ⊸PD|= ⊸⍥₂(/+ PD)) 220
1
1

    ⊃(≠/+ ⊸PD|= ⊸⍥₂(/+ PD)) 6
1
0
```

Yeah. An `eq` will tell them apart.

```uiua
IsAmicable ← =⊃(≠/+ ⊸PD|= ⊸⍥₂(/+ PD))
```

---

When we run this program again, we get the correct answer.

```uiua
    /+ ⊚ =1 ≡IsAmicable ⇡10000
31626
```

#### Crunch speed?

```uiua
    ⊙◌⍜now(/+ ⊚ =1 ≡IsAmicable⇡ 10000)
1.544128656387329
```

This is well under our hard limit of $60$ seconds, but surely we can do better.

### Better crunch

We already had some problems, with proper divisors, that we solved in [chapter 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#reducing-the-search-space).

We showed that we could reduce the search space, for complementary divisors, by
searching up to the square root of the range in question.

```uiua
    PDS ← ▽ =0 ⤚◿ ⇡₁ ⌊ ⊸√
    PDS 220
[1 2 4 5 10 11]
```

We can modify it to fit our needs here and save on a lot of calculations.
Let's create `PD'` which uses `PDS` and then divide the number argument by each
of its lower complementary factors. We just have to be mindful of squares.

```uiua
    ⊸PDS 64
64
[1 2 4 8]
```

Cool, and then getting the rest of the divisors.
We just need to divide to get the latter half of divisors,
join the arrays, deduplicate it and then drop the first element (the number itself).

```uiua
    off div ⊸PDS 64
    ⤚÷ ⊸PDS 64
[1 2 4 8]
[64 32 16 8]

    join⤚÷ ⊸PDS 64
    ⊂⤚÷ ⊸PDS 64
[64 32 16 8 1 2 4 8]

    dedup⊂⤚÷ ⊸PDS 64
    ◴⊂⤚÷ ⊸PDS 64
[64 32 16 8 1 2 4]

    drop,1◴⊂⤚÷ ⊸PDS 64
    ↘₁◴⊂⤚÷ ⊸PDS 64
[32 16 8 1 2 4]
```

Great. We have our `PD'`.

```uiua
    PD′ ← ↘₁◴⊂⤚÷ ⊸PDS
    PD′ 284
[142 71 1 2 4]
```

---

Okay. Let's define `IsAmicable'` in the same way as `IsAmicable`, just using `PD'`.

```uiua
IsAmicable′ ← =⊃(≠/+ ⊸PD′|= ⊸⍥₂(/+ PD′))
```

And does it give us the right answer?

```uiua
    /+ ⊚ = 1 ≡IsAmicable′ ⇡ 10000
31626
```

Yes.

#### Is it faster?

Also yes. Now it is sub second.

```uiua
    ⊙◌⍜now(/+ ⊚ = 1 ≡IsAmicable′ ⇡ 10000)
0.12900519371032715
```

#### Further optimizations?

For the range, we are running `PD'` $30$ thousand times.
We could reduce this down to ~$20$ thousand times
by splitting up the single and double `PD'` checks.
Then, `IsAmicable'` becomes two functions.

```uiua
IsAmicableCandidate ← = ⊸⍥₂(/+ PD′)
IsOwnAmicable       ← = /+ ⊸PD′
```

We'll run these two checks sequentially, meaning that `IsOwnAmicable` only
checks $15$ numbers instead of $10000.$

```uiua
    ⊸≡IsOwnAmicable ⊚= 1 ≡IsAmicableCandidate⇡ 10000
[0 6 28 220 284 496 1184 1210 2620 2924 5020 5564 6232 6368 8128]
[1 1 1 0 0 1 0 0 0 0 0 0 0 0 1]
```

Nice, we have 5 false positives.
Wowee, one of them is at the end; $8128$ has this property.

```uiua
    /+ PD′ 8128
8128
```

Anyway. We can just negate the `IsOwnAmicable` numbers and keep the rest.

```uiua
    ▽¬⊸≡IsOwnAmicable ⊚= 1 ≡IsAmicableCandidate⇡ 10000
[220 284 1184 1210 2620 2924 5020 5564 6232 6368]
```

Yup, that looks right.

```uiua
    /+▽¬⊸≡IsOwnAmicable ⊚= 1 ≡IsAmicableCandidate⇡ 10000
31626
```

#### How fast is it now?

```uiua
    ⊙◌⍜now(/+▽¬⊸≡IsOwnAmicable ⊚= 1 ≡IsAmicableCandidate⇡ 10000)
0.08643341064453125
```

We got it down to 0.08 seconds. It's some progress.
I reckon this is fast enough.
