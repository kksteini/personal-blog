+++
title = "27 - Quadratic Primes"
date = 2026-09-03
weight = 27
[extra]
doclink = "https://projecteuler.net/problem=27"
toc = true
pad = "https://uiua.org/pad?src=0_19_0__eJxdkcFrE0EYxe_zVzzYS0uQbJaeih7SQsFbCYLnze6X7tbNzDIzm1rw4kpbszXQU9eISBsFT4LHgBTBHP0vvr9EZuOG6Nxm3nu_-d6Mh36WQRbjIWmDjIyBTUKJAKEmSGWR63RMiEIZp3FoyQgPzwmj9CVsQmOYIkpcxLotCqkpLiIaFxmihKIXyLVyBy4mlVzTDEZKwybKOLAhg1QaS2EMNQJprXQqT4SHZwkhUxlGhZTnmJA2qZJIDazCaWEs8kzliNWZRIg94TVYmpA-t0kqTzCkTJ0hEEcD8OUNePaRbx_A1xd74Gr5OBDCw_G6XjNrKGPXQqIwLu46OmJOehKadEKSjBFPzTrSIJ-Aq88O9ut7d1W32nGjtcajgbvnUEljdZhKi94-hhi7-Ye0fpB_9WAf4UZXcSz62Fp8eYNHPd_30ZSpllz_RAC-ukfg-744-N_819bOxlf3XJYOIA43n9pa59-4LMHVJ65K9HEgRBMaNJ-qN69YzXk25dsH_vJhp-V20O2sxQVWNbh642xv3_P1xe_5qt4Vblu_42rRXdU8W-xwtdyGczXvcPn6FU_veuCvP1yz2XQXPJtia1Bf_AFzAxGK"
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "prime-numbers"]
+++

## Problem

Euler discovered the remarkable quadratic formula:

$$n^2 + n + 41$$

It turns out that the formula will produce $40$ primes for the consecutive
integer values $0 \le n \le 39$. However, when
$n = 40, 40^2 + 40 + 41 = 40(40 + 1) + 41$ is divisible by $41$,
and certainly when $n = 41, 41^2 + 41 + 41$ is clearly divisible by $41$.

The incredible formula $n^2 - 79n + 1601$ was discovered, which produces $80$
primes for the consecutive values $0 \le n \le 79$.
The product of the coefficients, $-79$ and $1601$, is $-126479$.

Considering quadratics of the form:
$$n^2 + an + b$$

* -where $|a| &lt; 1000$ and $|b| \le 1000$

* -where some $|k|$ is the modulus/absolute value of $k$

* * +e.g. $|11| = 11$ and $|-4| = 4$

Find the product of the coefficients, $a$ and $b$, for the quadratic expression
that produces the maximum number of primes for consecutive values of $n$,
starting with $n = 0$.

## Reducing the search space

Let's consider the individual parts of the formula.
Can we constrain them in any way?

### What of $b$?

Consider the formula.

$$n^2+a \times n+b$$

We have to consider $n$ starting at $0.$
When $n=0$ then the formula simplifies to $0 + 0 + b = b$.
Therefore, a constraint emerges.
The term $b$ must be a prime number, otherwise it fails at the start.

### Parity of $a$

Let's assume, for now, that the prime number $2$ can be discounted
from our observations, that is, we'll operate on the assumption that *all*
prime numbers that we care about are odd. What are the consequences?

Well, any $n^2 + a \times n$ must be even since $b$ is odd.
We want the total to be odd after all, otherwise it ain't a prime candidate.

$$(n^2+a \times n)+b$$
$$= (even)+odd$$
$$= odd$$

---

Now, $n^2$ is always the same parity (even/odd) as n.

$$1^2 = 1 \quad \quad 2^2 = 4 \quad \quad 3^2 = 9 \quad \quad 4^2 = 16 \quad \quad ...$$

Therefore, we need to choose term $a$ such that $a \times n$ is even, when $n$
is even and odd when $n$ is odd. That way, $n^2 + a \times n$ stays even
such that the whole thing stays odd.
Wowee.

First of all, can this work?
Let's see.

---
**If $a$ is an odd number, what happens?**

* **If $n$ is odd**

$$ n^2 + a \times n $$
$$ = odd + odd \times odd $$
$$ = odd + odd = even$$

* **If $n$ is even**

$$ n^2 + a \times n $$
$$ = even + odd \times even $$
$$ = even + even = even $$

---

Cool, $a$ being odd is possible.
If we do the same thing with $a$ as an even number, we run into issues
when $n$ is odd. You can try sketching that out for completeness if you want.

Anyway, the whole formula $n^2 + a \times n + b$ stays odd if
$b$ is an odd prime number and $a$ is odd.
We therefore have another constraint... unless we actually need to
consider $2.$

#### Is 2 a candidate?

Can $2$ be a candidate for $b$ in the $n^2+a \times n + b$ formula?

---

**What if $a$ is odd?**

We run into a problem when $n$ is even.

$$ n^2+a \times n + 2 $$
$$ even + odd \times even + even $$
$$ even + even + even = even $$

Since odd instances of $n$ produce an even outcome, it would always have to
produce $2,$ the only even prime number there is. However, since $n^2$ dominates
the formula, that can't be.

---

**What if $a$ is even?**

We also have a problem when $n$ is even.

$$ n^2+a \times n + 2 $$
$$ even + even \times even + even $$
$$ even + even + even = even $$

This is the same issue as before.

Therefore we *can* not consider $2$ as a $b$
candidate for ever larger $n$ values. **Technically**, this doesn't exclude
short runs for $b=2$, ...but
we are interested in long runs.

### Constraints

Take a look at the formula again.

$$n^2 + an + b$$

We've derived two constraints from the problem and its description so far.

>**Constraint 1:**
>The term, $b$, must be a prime number. Otherwise $n=0$, or the base case, fails.

> **Constraint 2:**
> $a$ must be odd so that ever larger consecutive values of $n$
> produce odd numbers, or prime candidates.

## Components

### Properly pervasive prime program

Way back,
in [problem 3](@/uiua-some-euler-problems/03-largest-prime-factor.md#pervasion),
we derived a pervasive prime checking method using `un reduce mul` as its main component.
It is constructed and used like so.

```uiua
    IsPrime = eq last by unreducemul
    IsPrime ← = ⊣ ⊸°/×

    keep by IsPrime range,2 30
    ▽ ⊸IsPrime⇡₂30
[2 3 5 7 11 13 17 19 23 29]
```

Since the term $a$ can be negative, we will end up having to check
negative numbers and whether they are prime.
Our prime checking function does run into problems for any number less than $2$ because
of `un reduce mul`.

```uiua
    IsPrime ¯1
"Error: Cannot get primes of non-positive number ¯1"

    IsPrime 1
"Error: Cannot take last of an empty array"
```

The funniest way I can come up with, that deals with this, is just replacing
all numbers below 2 with the number 4. Let's hope it's fast enough.

We'll start with a test range, -5 to 4.

```uiua
    -5 ⇡10
[¯5 ¯4 ¯3 ¯2 ¯1 0 1 2 3 4]
```

Identify numbers less than $2.$

```uiua
    by lt 2 -5 ⇡10
    ⊸<2 -5 ⇡10
[¯5 ¯4 ¯3 ¯2 ¯1 0 1 2 3 4]
[1 1 1 1 1 1 1 0 0 0]
```

Imagine that we keep these candidates.
We would get the array `[¯5 ¯4 ¯3 ¯2 ¯1 0 1]`.
To turn all of them into `4` we could do something like `add 4 self sub`.
That would work with `under keep`.

```uiua
    ⍜▽ (+4˙-) ⊸< 2 - 5 ⇡ 10
[4 4 4 4 4 4 4 2 3 4]
```

We can also consider the context of `under`.
If you read the [inverses tutorial](https://www.uiua.org/tutorial/Inverses)
then you might notice the following sentence.

> \[For under:\] If you wanted to set a value in an array rather than
> modifying it, you could use ◌ pop or ⋅ gap instead of × multiply.

So, can we just *set* the value to $4$ with `gap 4`?

```uiua
    ⍜▽⋅4 ⊸<2 - 5 ⇡ 10
[4 4 4 4 4 4 4 2 3 4]
```

Yes. Now, putting it all together.

```uiua
    IsPrime ← = ⊣ ⊸°/× ⍜▽ ⋅4 ⊸< 2

    ▽ ⊸IsPrime -30 ⇡60
[2 3 5 7 11 13 17 19 23 29]
```

Great. It works. Now, is it slower than the original prime checker?

```uiua
# For small ranges
    ⊙◌⍜now(▽ ⊸IsPrime -300000 ⇡ 600000)
0.04130816459655762
    ⊙◌⍜now(=⊣ ⊸°/× ⇡₂600000)
0.03666853904724121

# For large ranges
    ⊙◌⍜now(IsPrime⇡₂87654321)
10.450777292251587
    ⊙◌⍜now(=⊣  ⊸°/× ⇡₂87654321)
9.584043979644775
```

It is slower, but not by a crazy amount. I think it strikes a good
balance between being funny and usable.
You can probably discover a more elegant way for yourself, lol.
If you do, send them my way and I will showcase them in the appendix.

* [<uiuachallenges@anub.is>](uiuachallenges@anub.is)

### Candidates

We'll be testing a bunch of values for $a$ and $b.$
It might be useful to keep a list of inputs $(a,b)$ then.
The problem description has a primary constraint of
$|a| < 1000 \quad and \quad |b| \le 1000$ and we've
derived two more constraints.

Let's create an array of $a$ and $b$ candidates and then join them.

```uiua
# Constraint 2: a must be odd
A ← -1000 ▽ ⊸◿ 2 ⇡ 2000

# Constraint 1: b must be prime
B ← ▽ ⊸IsPrime⇡₂1000
```

We can then `table join` all of the terms to get our list of inputs.

```uiua
Candidates ← ⊞⊂ A B
```

So, how many candidates do we have?

```uiua
    len Candidates
    ⧻ Candidates
1000
```

Oh wait, we're getting a list of lists of inputs, aren't we?

```uiua
    shape Candidates
    △ Candidates
[1000 168 2]
```

Right. We have 1000 odd numbers and 168 primes. We are getting $1000$ rows for each
odd number paired with every prime candidate.
We want to flatten this into a single list of inputs. Luckily, that's easy.
We want vectors, $(a,b)$, so we `deshape,2`.

```uiua
    Candidates ← ♭₂ ⊞⊂ A B

    ⧻ Candidates
168000
```

Nice! $168000$ inputs is a good shave compared to some $4$ million inputs
if we had naively joined two ranges of $-1000$ to $1000$.

### Prime Candidate Reducer

We can solve this problem with a sort of "last input standing" tournament.

For a list of candidates, we want some function, `Reducer`, that takes
two arguments, `Candidates` and `n`,
and returns a filtered list of `Candidates` based on $n^2+an+b$ being prime.

Then we apply this reducer function to successive and increasing $n$ values.

---

Let's look at a random slice of candidates and build up the reducer from that.

```uiua
    TestCandidates ← ⊏ ⇡₆₅₀₀₁65006 Candidates
    TestCandidates
#  a    b 
#  |    |
#  v    v
╭─
╷ ¯227 887
  ¯227 907
  ¯227 911
  ¯227 919
  ¯227 929
  ¯227 937
           ╯
```

Now, the left column is the $a$ terms and the right column $b.$
If we want to work on all $a$ values at once, it is easier to do so
by transforming the matrix first.

```uiua
    ⍉ TestCandidates
# rows:
#   a
#   b
╭─
╷ ¯227 ¯227 ¯227 ¯227 ¯227 ¯227
   887  907  911  919  929  937
                               ╯
```

Let's assume that we have the argument list as `trans TestCandidates n` and
that $n=5.$
Now, if we want to multiply all $a$ terms, it's as easy as `under first mul`.

```uiua
    ⍜⊢×⍉ TestCandidates 5
# rows:
#   a*n
#   b
╭─
╷ ¯1135 ¯1135 ¯1135 ¯1135 ¯1135 ¯1135
    887   907   911   919   929   937
                                     ╯
```

Actually, at this point we could just reduce these two rows, add $n^2$ over the
results and check which ones are prime. We just need to make sure to preserve
the original candidates and then give back prime filtered candidates.

To do that, our function needs to create an extra argument at the end, $n^2.$
We need to keep in mind that since we're building a function we must manipulate
the arguments after they've been passed to us.

So instead of:

```uiua
    ⍉ TestCandidates on self mul 5
    ⍉ TestCandidates⟜˙× 5
25
5
╭─
╷ ¯227 ¯227 ¯227 ¯227 ¯227 ¯227
   887  907  911  919  929  937
                                ╯
```

We must manipulate the arguments in another way. We could just `fork`
and keep the first two unchanged with `dip id`. The next step of `fork`
would be to ignore the candidates, with `gap`, and then targeting
$n$ with `self mul` for $n^2.$

```uiua
    ⊃⊙∘⋅˙× ⍉ TestCandidates 5
25
5
╭─
╷ ¯227 ¯227 ¯227 ¯227 ¯227 ¯227
   887  907  911  919  929  937
                                ╯
```

---

Now, we have arguments `TransCandidates n n²`.
Therefore, we can multiply all $a$ with $n$ using `under first mul`:

```uiua
    ⍜⊢× ⊃⊙∘⋅˙× ⍉ TestCandidates 5
25
╭─
╷ ¯1135 ¯1135 ¯1135 ¯1135 ¯1135 ¯1135
    887   907   911   919   929   937
                                      ╯
```

Calculate all $an+b$ with `reduce add`:

```uiua
    /+⍜⊢× ⊃⊙∘⋅˙× ⍉ TestCandidates 5
25
[¯248 ¯228 ¯224 ¯216 ¯206 ¯198]
```

And since the last argument is `n²`
we add $n^2$ to the mix with `add`.

```uiua
    +/+⍜⊢× ⊃⊙∘⋅˙× ⍉ TestCandidates 5
[¯223 ¯203 ¯199 ¯191 ¯181 ¯173]
```

---

Next is to check which ones of these are prime.

```uiua
    IsPrime +/+⍜⊢× ⊃⊙∘⋅˙× ⍉ TestCandidates 5
[0 0 0 0 0 0]
```

Huh. None of them. Well, we do get some with $2$ instead of $5.$

```uiua
    IsPrime +/+⍜⊢× ⊃⊙∘⋅˙× ⍉ TestCandidates 2
[0 1 1 0 1 1]
```

We have our mask array, so we need to keep the original candidate list
to work on. We can wrap what we've done in parentheses and target
the candidate list with `off`.

> Don't feel bad if you never remember the difference between
> `below`, `on`, `by`, `on` and `off`. I myself cycled through
> them until I found the one that does what I want :)

```uiua
    ⤚(IsPrime +/+⍜⊢× ⊃⊙∘⋅˙×) ⍉ TestCandidates 2
╭─
╷ ¯227 ¯227 ¯227 ¯227 ¯227 ¯227
   887  907  911  919  929  937
                                ╯
[0 1 1 0 1 1]
```

And keepin it?

```uiua
    ▽⤚(IsPrime +/+⍜⊢× ⊃⊙∘⋅˙×) ⍉ TestCandidates 2
╭─
╷ 887 907 911 919 929 937
                          ╯
```

Oh. That's not right. We need to transform the candidates before we keep them.
So, let's `dip` past the mask array and transform it.
Since we'll be reusing this reducer function it would be good to
transform the candidates back. We'll do that with `under dip trans keep`.

```uiua
    ⍜⊙⍉▽⤚(IsPrime +/+⍜⊢× ⊃⊙∘⋅˙×) ⍉ TestCandidates 2
╭─
╷ ¯227 ¯227 ¯227 ¯227
   907  911  929  937
                      ╯
```

Great! That's a filtered list.
Let's store this procedure.

```uiua
    PrimeReducer ← ⍜⊙⍉▽⤚(IsPrime+ /+ ⍜⊢ × ⊃⊙∘⋅˙×)
```

## Solution

We have our candidates and we have our prime reducer function.
Now, we just need to use that to find the parameters for the most
successive primes.

### Do the do

We want a do loop that reduces primes until there is only one candidate.
Let's assume there is only one ultimate candidate (given the problem description).

We want increasing $n$ inputs to the `PrimeReducer` function as well.
So, here's a rough idea of the do loop.

```plain
do(PrimeReducer IncreaseN|WhileManyCandidates) trans Candidates 0
```

Increasing the $n$ arguments should be as simple as `dip add,1`.
In the position we've put it, the increment happens before the reducer.
However, we've chosen all $b$ such that $n=0$ results in primes and that's fine
since we can skip $n=0.$

Checking how many candidates remain should be easy enough.
We will have transformed our candidates before it enters the loop
so we have to be careful about how we do it. It might spin forever
if we don't `trans` it before a length check.

```uiua
    ⧻ Candidates
168000
    ⧻ ⍉ Candidates
2
```

So, something like `ne1 len by trans`

Won't this just work if we put everything together?

```uiua
    ⍢(PrimeReducer ⊙+₁|≠1 ⧻ ⊸⍉) ⍉ Candidates 0
"Error: Maximum execution time exceeded"
```

Ah. Something is wrong. How do we go about debugging something like this?
Well, we have to follow the arguments. Are they preserved and correct throughout
the loops?

If we simulate the condition body?

```uiua
    ≠1 ⧻ ⊸⍉ Candidates 0
0
╭─
      168000×2 ℝ
  ¯999-999 μ226.5685
                     ╯
1
```

That's fine. The $1$ will be consumed by the do loop checker and the do body
will receive the two arguments. Simulating the loop body?

```uiua
    PrimeReducer⊙+₁ ⍉ Candidates 0
╭─
      2×38434 ℝ
  ¯995-999 μ345.2722
                     ╯
```

Ah, yes. We're consuming the $n.$
We should add a `by` then. Does it finish then?

```uiua
    ⍢(⊸PrimeReducer ⊙+₁|≠1 ⧻ ⊸⍉) ⍉ Candidates 0
70
╭─
╷ ¯61
  971
      ╯
```

Yes! That works. And we have a candidate!
$$(a,b) = (-61, 971)$$

### Answer

After running the loop we can get rid of the preserved $n$ with `dippop` if we want.
After that we have the candidate as a list of numbers. We can just `reduce mul`
and then `first` out the number.
So, the full solution is:

```uiua
IsPrime  ← = ⊣ ⊸°/×

A            ← -1000 ▽ ⊸◿ 2 ⇡ 2000
B            ← ▽ ⊸IsPrimeP⇡₂1000
Candidates   ← ♭₂ ⊞⊂ A B
PrimeReducer ← ⍜⊙⍉▽⤚(IsPrime+ /+ ⍜⊢ × ⊃⊙∘⋅˙×)

    ⊢/×⊙◌⍢(⊸PrimeReducer⊙+₁|≠1 ⧻⊸⍉) ⍉ Candidates 0
¯59231
```

### Fast?

```uiua
    ⊙◌⍜now(⊢/×⊙◌ ⍢(⊸PrimeReducer ⊙+₁|≠1 ⧻ ⊸⍉) ⍉ Candidates 0)
0.013109207153320313
```

Yes! 13 milliseconds. We can be happy with that.

## Appendix

### First draft - Not pervasive enough

Here's my initial solution. It runs in around 1-5 seconds depending on
whether it's running in the pad or in the repl.

It also uses fold and makes it spin. Why I didn't think to make it a
do loop instead is beyond me.

```uiua
IsP ← ⨬(0|= ⊣ ⊸°/×) ⊸>1

ProducesPrime ← IsP ++⊃(⋅⋅˙×|×⊙⋅∘|⋅∘)°⊟
♭₂ ⊞⊂ (-999 ⍜÷ ⇡ 2 2000) ▽ ⊸IsP⇡₃1000
∧(⨬(▽ ⊸˜≡(ProducesPrime)|⋅∘)=1 ⊃(⋅⧻|⊙∘)) ⇡ 1000
/×⊣
```

I was going to do a write up on how I derived this, and how one might learn to do better,
but since I had a long vacation between when I wrote the program and when I started
writing this article, I decided to just start over.

**Thanks to Tyz for pointing out the non-pervasive slowdown of the initial
solution and helping with cleaning up some functions.**
