+++
title = "26 - Reciprocal Cycles"
date = 2026-08-05
weight = 26
[extra]
doclink = "https://projecteuler.net/problem=26"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-rc_1__eJxVkb9qG0EQxvt9ioErImGtdJcihcHVQSBwnEPyBKu9kbX4dCt29ywMbpLAxToQpJMNLuxAkItAGhcGF4Gk9FvMk4Q5-U887cz3--abieBt7cIUHRQYlCn9rohAVfV4aPyoNrWS3s5QYl2ik3NnxyXO_Oj1G-lQm7mzWpVSH-sS_Uhk1s5TWxUmGFsBNd-Amg1Qe07LS6DlZSw-4OxjwDlsiyf-rpMYqL29v6D1b7F_hO69s0Wt8aFP7RcGtOd0ekanZ4IR7POop9X33v-qB4etZoc-fzp5sVUfEiYoUxXofEe4v3hEJkJEkCl3gD5AeqxLoyGvZ2N0IkvzJzvJVI7EeKDNHa1vaNVQe_tM7kMSxzHz0inqQ1hMsTsyc4wHVXoLYYpQbt1EBB4D2Am45-Vs1Y04VR0gC2WHjODdBLwdcI8HVHjlwdYOVOUX6IYign22WhiPAzATkMkAFggVYgHB8ptRB9j-bCgEXf_s_fmVnGRp3t_L0nxEzQ9aXvU4HG3ugNY3QKuGD_uUbSdLc_p6BZLjdFv9Azfx4ys="
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

A unit fraction contains $1$ in the numerator. The decimal representation of
the unit fractions with denominators $2$ to $10$ are given:

$$ \begin{aligned}
1/2 &amp;= 0.5\\\\
1/3 &amp;=0.(3)\\\\
1/4 &amp;=0.25\\\\
1/5 &amp;= 0.2\\\\
1/6 &amp;= 0.1(6)\\\\
1/7 &amp;= 0.(142857)\\\\
1/8 &amp;= 0.125\\\\
1/9 &amp;= 0.(1)\\\\
1/10 &amp;= 0.1
\end{aligned}$$

Where $0.1(6)$ means $0.166666\cdots$, and has a $1$-digit recurring cycle.
It can be seen that $1/7$ has a $6$-digit recurring cycle.
Find the value of $d \lt 1000$ for which $1/d$ contains the longest
recurring cycle in its decimal fraction part.

## Research

I found [this article](https://en.wikipedia.org/wiki/Repeating_decimal#Other_properties_of_repetend_lengths)
by looking for "number theory decimal fraction repeat".

I didn't understand a lot of that article but the following stood out as helpful.

> The period of $\frac{1}{k}$ for integer $k$ is always $\le k - 1.$

The period refers to how many digits are in the recurring cycle of the
decimal fraction part.
Let's call this **finding 1**.
This allows us to reduce the search space of repeating digits considerably.

### Long division
We can look into long division for finding repeating digits of a division.

Here's how I think about long division.
* -Try dividing a fraction $\frac{n}{d}$.
* * +If $n \lt d$ , record $0$, then multiply $n$ by $10$ and try again
* * +Else, record integer division
* * * °If remainder is $0$, stop.
* * * °Otherwise, continue procedure with $\frac{10*remainder}{d}$

**Example: 1 divided by 7**

```
Step 1: 1/7
  1 is smaller than 7, record 0
  continue with 1*10 / 7

Step 2: 10/7
  integer division of 10/7 is 1, record 1
  remainder is 3, continue with 10*3/7

Step 3: 30/7
  integer division of 30/7 is 4, record 4
  remainder is 2, continue with 20/7

Step 4: 20/7
  integer division of 20/7 is 2, record 2
  remainder is 6, continue with 60/7

Step 5: 60/7
  integer division of 60/7 is 8, record 8
  remainder is 4, continue with 40/7

Step 6: 40/7
  integer division is 5, record 5
  remainder is 5, continue with 50/7

Step 7: 50/7
  integer division is 7, record 7
  remainder is 1, continue with 10/7...
  Wait a second, that's just step 2 again.
  We'll be looping from here!
```

From what we've recorded and
because of the looping from step 7 to step 2, we get
$0.14285714285714285...$

## Building the procedure

We want some procedure that counts how many repeating digits there are for a fraction.
We can encode this procedure in long division, somehow.
Let's think about what we know so far:

* -We are not required to return the digits, just count them.
* -We know that the numerator, top half of the fraction, always starts at $1.$
* -We can stop the procedure at $k-1$ steps for some $\frac{1}{k}.$
* * +According to **finding 1**.

### Making the loop

Since we don't need to return the digits, it might be easy to
just return the remainders multiplied by 10.
We always need those to advance to the next step, after all, and we could
collect them over a looping process in Uiua.

For $\frac{1}{7}$ these worked out to be `10 30 20 60 40 50`; see steps $2-7$.
Then, counting unique remainders may serve to solve this problem.
A high level outline for a Uiua do loop, that accomplishes that,
might look like this.

```plain
OverProduceRemainder → <manipulates arguments>
RemainderStep        → <long division yielding remainder>
LoopCondition        → <loop unless iteration_count=k or remainder=0>

do(OverProduceRemainder RemainderStep|LoopCondition) Some Arguments
```

> Overproducing on elements will collect them during the looping process in `do`.
> If you're unfamiliar then please have a re-read of [do docs](https://uiua.org/docs/do)

Let's implement this, step by step.

---

We need to decide what arguments to use. Maybe we should have the order of arguments
be `remainder divisor iteration_count`. What would the loop condition become here?

For $\frac{1}{7}$ we would start with the arguments `1 7 0`.
This should yield $1$ since we want to continue.

It should yield $0$ when either remainder is $0$ or if the iteration count is
$7-1=6$. We can simplify this to a *not equals* check by starting at $1$.

So, our starting arguments are `1 7 1`.
Terminating arguments look something like `0 9 20` and `12 40 40`.

```uiua
# I'm using arrays to compress output
# We calculate whether the remainder is 0
    [≠0 1 7 1]
[1 7 1]
    [≠0 0 7 1]
[0 7 1]
```

Next, we dip past the `ne 0` calculation to check whether the second and third
arguments are different.

```uiua
    [⊙≠ ≠0 1 7 1]
[1 1]
    [⊙≠ ≠0 1 7 7]
[1 0]
```

Now, we want to return $0$ if either is 0. We can do that with `min`.

```uiua
    ↧ ⊙≠ ≠0 1 7 7
0
    ↧ ⊙≠ ≠0 0 7 4
0
    ↧ ⊙≠ ≠0 1 7 1
1
```

Great. That's our loop condition.

```uiua
LoopCondition ← ↧ ⊙≠≠0
```

---

Now, at each step we want to calculate the remainder of the division
and multiply that by $10.$
That shouldn't be too hard.
Let's imagine we're at step 4, but that receives a remainder of $20$ and then produces
the next one, $60.$

```uiua
# Let's try mod
    [◿ 20 7]
[7]

# Uh, backwards then
    [˜◿20 7]
[6]

# And multiplied by 10
    [×₁₀ ⊸˜◿20 7]
[60 7]
```

Good. So our remainder step is simply
```uiua
RemStep ← ×10 ⊸˜◿
```

---

Now, we need to overproduce.
With our three arguments in mind, after the `RemStep`, we want to
make a function which takes `a b c` and produces `a b c a`. We can then
use it to overproduce an `a` which is
**pushed off** in the do loop and subsequently collected.

What we could do is use `fork`.
One half of the `fork` just passes in `id` which targets `a`, the first argument.
The second half of the fork targets `a b c`. That would be `dip dip id`, a
no-op for three arguments.

```uiua
    [⊃(∘|⊙⊙∘) 1 2 3]
[1 1 2 3]
```

Oh, whoops. That produces `a a b c`. We'll simply flip
the functions to `fork`.

```uiua
    [⊃(⊙⊙∘|∘) 1 2 3]
[1 2 3 1]
```

Awesome. We have our overproducing function.
We can skip the parentheses.

```uiua
OverProduce ← ⊃⊙⊙∘∘
```

---

Putting it all together. We get the following.

```uiua
LoopCondition ← ↧ ⊙≠ ≠0
RemStep       ← ×10 ⊸˜◿
OverProduce   ← ⊃⊙⊙∘∘
Period        ← ⍢(OverProduce RemStep|LoopCondition)
```

Let's run it with the initial arguments for $\frac{1}{7}$.

```uiua
    Period 1 7 1
"Error: Maximum execution time exceeded"
```

Oh. Yes, we need to increment our counter.
We double `dip` and `add,1`. Let's just slot it into `Period`.

```uiua
LoopCondition ← ↧ ⊙≠ ≠0
RemStep       ← ×10 ⊸˜◿
OverProduce   ← ⊃⊙⊙∘∘
Period ← ⍢(OverProduce RemStep⊙⊙+₁|LoopCondition)
```

Running with our initial arguments again, we get:

```uiua
    Period 1 7 1
[10 30 20 60 40 50]
```

These do correspond to the repeating digits of $7$.
Let's check though just to be sure:

```uiua
  ⌊ ÷7 Period 1 7 1
  ÷ 7 1

[1 4 2 8 5 7]
0.14285714285714285
```

Wowee!

### Crunching the numbers

It would make things easier if we could simply supply a single number $k$,
to be the divisor, and get its $\frac{1}{k}$ period.

Since the numerator always starts at one, we can move that into the `Period` function.
Let's do that and rename it to `PeriodLoop`.
The counter also always starts at $1$ but that gets supplied after the divisor.
Luckily we can just call `backward` on `PeriodLoop` to solve that issue.
Let's do that and store this procedure as a function `Period`.

Then our new definitions become:
```uiua
LoopCondition ← ↧ ⊙≠ ≠0
RemStep       ← ×10 ⊸˜◿
OverProduce   ← ⊃⊙⊙∘∘

PeriodLoop ← ⍢(OverProduce RemStep⊙⊙+₁|LoopCondition) 1
Period     ← ˜PeriodLoop 1
```

Running it on $7$ yields:

```uiua
    Period 7
[10 30 20 60 40 50]
```

Now, let's find the largest period over the first $15$ digits.
We will create a range, from 1-15, get the periods of each and calculate
the count of distinct remainders.

We'll `sort` and `dedup` before acquiring `len`.

> See sortedness flags in [optimizations](https://www.uiua.org/docs/optimizations)

```uiua
    ≡(⧻◴⍆Period)⇡₁15
[0 1 1 3 2 2 6 4 1 2 2 3 6 7 2]
```

Alright. Now, the largest period we acquire with `by reduce max`.
The index of the largest period we get with `add,1 where eq`; we
need to add $1$ to account for our range starting at $1.$
The `add,1 where eq` clause will return an array so we can get at it with
either `first` or `last`. We will just assume that the solution to the problem
is unique since it is posed that way.

```uiua
    ⊣+₁⊚=⊸/↥≡(⧻◴⍆Period)⇡₁15
14
```

Hmm... Something is off though.

```uiua
    ≡(⧻◴⍆Period)⇡₁15
[0 1 1 3 2 2 6 4 1 2 2 3 6 7 2]

    ÷ 14 1
0.07142857142857142
```

Ah! I made a mistake about the periods!
I counted the initial zero, on $14$, before the repeating digits.
There are $7$ unique remainders, sure, but only $6$ of them contribute to a period.

There are other numbers too. $\frac{1}{12}$ for example repeats on $.333$ but we
see remainders for $0$ and $8$ before that: $0.08333333.$

We're missing a way to detect cycles.
Maybe we can salvage this without cycle detection though.

### Cyclic numbers

The [article](https://en.wikipedia.org/wiki/Repeating_decimal#Cyclic_numbers)
also mentions cyclic numbers.
All cyclic numbers, $\frac{1}{k}$,
have a period of length $k-1$.

Therefore, my *broken* method above will find cyclic numbers.
This we can further infer from the claim that all rational numbers
are either repeating or terminating with a repeating period capped
at the maximum of $k-1$.

This also means that we can cap our
total search at the largest cyclical number
since it will outpace all others before it.

Let's suppose the problem statement would just tell us "btw, $701$
is a cyclical number".
We would then know that the numbers from 1-700 are not candidates anymore since
they can not exceed $700$ repeating digits which is the case for $701.$

#### Disgustingly lazy

So, this solution is a sinking ship but I intend to run it ashore.
I am hoping that the answer to this problem is a cyclic number.

My plan is to identify the largest cyclic number and then
check if its period is larger than all sets of unique remainders
for the numbers larger than it. If that is the case then
the largest cyclical number is also the answer to this problem.

Let's find the largest number, $k$, such that the count of
unique remainders is $k-1.$

Let's rename some things before continuing to better reflect
what's going on.

```uiua
LoopCondition ← ↧ ⊙≠ ≠0
RemStep       ← ×10 ⊸˜◿
OverProduce   ← ⊃⊙⊙∘∘

RemLoop    ← ⍢(OverProduce RemStep⊙⊙+₁|LoopCondition) 1
Remainders ← ˜RemLoop 1
```

Now, to identify the largest cycle we'll just start at $1000$ and count down.
At every step we check whether the counter $k$, when passed to `Remainders`,
produces a set of unique remainders of length $k-1$.

```uiua
    ⍢(-₁|≠ +₁ ⧻◴⍆⊸Remainders) 1000
983
```

Wowee. That's large.
Now, keep this cyclical number in mind.
If no set of remainders exceeds $982$ elements, for
numbers higher than $983$, then $983$ itself is the answer to this problem.
Let's calculate the distinct count of `Remainders` for all numbers
on the range $983$ to $1000.$

```uiua
    /↥≡(+₁⧻ ◴ ⍆ Remainders) ⇡₉₈₃1000
983
```

And when submitted, that's the correct answer!

For completeness, we might structure the solution like so:

```uiua
  # Largest Cyclic Number
  LCN ← ⍢(-₁|≠ +₁ ⧻◴⍆⊸Remainders) 1000
  ⨬(¯1|LCN)=LCN/↥≡(+₁⧻ ◴ ⍆ Remainders) +LCN⇡ -LCN 1000
983
```

## Next steps

I think our logic is sound but it falls a little short of satisfying.

Maybe we could implement some cycle detection by encoding a breaker
through [map](https://www.uiua.org/docs/map) or some such.

I've had my fill of this problem, for now, but I would be happy to showcase
other solutions if you make them or have made them.

Feel free to shout at me via [<eulerproblems@anub.is>](eulerproblems@anub.is).
$$
