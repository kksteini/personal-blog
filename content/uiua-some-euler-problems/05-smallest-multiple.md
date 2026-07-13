+++
title = "5 - Smallest Multiple"
date = 2026-06-01
weight = 5
[extra]
doclink = "https://projecteuler.net/problem=5"
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxVkD1OAzEQRnufYiQ3ILHZJRINB4AKiYILzCaTrCX_rMbjhNBBAQoSdaR0KegocobkJnsSZDaQUNvz3tOn4SYwjEnQ2AiR6FppQJ_qgYllMgmLGBwVlCxx0XKoLblYVldFdGgtRSlcsmJaS6VSGu7ZOIIJjiSweUIxwUOYAFqrNPjkauJ4AZfFsFK7bblfQfe26V6eh1U-fmD0sQ2RQAJMSQCBwxxa4sOp6j6W-eMteWIUAoRRSF6yoj0xR6VhEjhrMyGq7mtddcvNbtu9r3uAgDQEDh-NQ3ukHO_DjHrAoVqV3evnf7kHZMYFzI00IE0OPwCzvycBU0soNP4JkoYM97aocovWGXnXT7jI7w4kTEka4t8Vcujv2n8rwtjMTDS1JagXp519uDSkNDD6KcFZnvt8oMr9Sn0DMjGvpw=="
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

$2520$ is the smallest number that can be divided by each of the numbers from
$1$ to $10$ without any remainder. What is the smallest positive number that
is **evenly divisible** by all of the numbers from $1$ to $20$?

## Foundations before we begin

### The Fundamental theorem of arithmetic

Prime factors of a number are tightly linked to its divisibility.
Please take a skim of the [Fundamental theorem of arithmetic](https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic)
on Wikipedia to see why. The article says the following:

> Every integer greater than 1 is either prime or can be represented uniquely as
> a product of prime numbers.

#### Uiua prime factorization

The Wikipedia article gives this example

$$ 1200 = 2^4 \times 3^1 \times 5^2 $$

In a previous chapter we discussed [un reduce mul](@/uiua-some-euler-problems/03-largest-prime-factor.md#check-the-idioms).
Applying it to $1200$ is likewise prime factorizing it.

```uiua
    °/× 1200
[2 2 2 2 3 5 5]
```

This agrees with the Wiki article.
These are different representations, sure, but they are equivalent.

## Towards a solution

### Why are prime factors important to this problem?

Let's take the number $18$ as an example.
Its prime factors are $[2\ 3\ 3].$
For any other number, $N$, to be divisible by $18$ it needs to
be representable as $N = K \times 18$ where $K$ is a whole number.

Now, $18$ can be represented as a product of its prime factors:

$$ N = K \times 2 \times 3 \times 3$$

So, **if we spot the prime factors of $18$** in any prime factorization
of some number, then we know that it is divisible by $18.$
We can consider the remainder after we divide, or take away $[2\ 3\ 3]$, to be the
candidate $K$.

$$ Suppose\ prime\ factors\ of\ some\ N\ are\ [2\ 2\ 3\ 3\ 3] $$
$$ We\ spot\ the\ prime\ factors\ of\ 18:\ [2\ 3\ 3] $$
$$ Isolating\ 18 → [18\ 2\ 3] $$
$$ Dividing\ by,\ or\ removing\ 18 → [1\ 2\ 3] $$

We can stop here and assert divisibility by $18$.
We can also keep going on to show that $N$ is of the
form $K \times 18.$

$$ [2\ 2\ 3\ 3\ 3] \xrightarrow{\text{Removing factors of 18}} [1\ 2\ 3] $$
$$ therefore\ K=1 \times 2 \times 3 = 6 $$
$$ N = 6 \times 18 $$

**Likewise we can tell the opposite.** If a number does not include the entirety
of the prime factors of $18$ it is not cleanly divisible by it.

Take $1200$ again.

```uiua
    °/× 1200
[2 2 2 2 3 5 5]
```

Since there is only one factor of $3$ in there, we can already see that $1200$ is
not cleanly divisible by $18.$

$$ \frac{1200}{18} = 66.666...$$

#### Small exercise 1

Which ones of $37926$, $14928$ and $3258$ are divisible by $18$ cleanly?
Here are the factors:

```uiua
    °/× 37926
[2 3 3 7 7 43]

    °/× 14928
[2 2 2 2 3 311]

    °/× 3258
[2 3 3 181]
```

**Answer**
It's 37926 and 3258.
Looking at the prime factors of $18$ again:

```uiua
    °/× 18
[2 3 3]
```

Any other number which contains at least one factor of 2 and two factors of 3 will
be divisible by 18. You can replace these factors by 18 and the product reduction
will still give back the original number.

```uiua
    °/× 37926
[2 3 3 7 7 43]

# Replace and reduce
    /× [18 7 7 43]
37926
```

### Connecting numbers on prime factors

Do we now have a good intuition for how to answer a question of the form:

* *What is the smallest number divisible by both $K$ and $T$?*

Let's look at a concrete example and ask the same question of $18$ vs $12.$
Here are their prime factorizations.

```uiua
    °/× 18
[2 3 3]
    °/× 12
[2 2 3]
```

Well, the lowest number divisible by $12$ has the prime factors $[2\ 2\ 3]$ which
is just $12$ itself. So if we choose $[2\ 2\ 3]$ we've already satisfied this
constraint from the perspective of $12.$ But $18$ needs a little extra.
The only thing missing is a $3.$

Therefore, the smallest number divisible by both $18$ and $12$ is

```uiua
    /× [2 2 3 3]
36
```

Another way of thinking about this problem:

* *The smallest number divisible by a collection of numbers, is the
product of the maximal count of each prime factor over the collection*

A hecking mouthful. Let's test it out.

Take f.x, $9$, $60$ and $14.$

```uiua
    °/× 9
[3 3]
    °/× 60
[2 2 3 5]
    °/× 14
[2 7]
```

The maximal count of factor $2$ is two times in $60.$

The maximal count of factor $3$ is two times in $9.$

Factors $5$ and $7$ have a max count of only one.

Therefore the smallest number divisible by $9$, $60$ and $14$ is

```uiua
    /× [2 2 3 3 5 7]
1260
```

## Doing it with Uiua

### Counting occurrences of factors with keep

We want to count the occurrences of factors for $1200.$
Let's start by prime factorizing

```uiua
    °/× 1200
[2 2 2 2 3 5 5]
```

How do we count 'em up?
Semantically it might make sense to try [occurrences](https://www.uiua.org/docs/occurrences).

```uiua
    ⧆°/× 1200
[0 1 2 3 0 0 1]
```

Hmm, no despite its name it doesn't seem immediately helpful.
Let's devour some more documentation.
We will eventually come across this tidbit in [keep](https://www.uiua.org/docs/keep).

> un keep (°▽) splits an array into a counts list and an array
> with adjacent similar rows deduplicated.

Since `un reduce mul` is sorted, this is a good candidate.

```uiua
    °▽ °/× 1200
[2 3 5]
[4 1 2]
```

Yes! We get an array of factors and an array of factor counts.
We can turn this back into the original number by applying
the `power` function between them and then `reduce mul`.

```uiua
    ⁿ [4 1 2] [2 3 5]
[16 3 25]
    /× [16 3 25]
1200
```

#### And with multiple numbers?

Let's take the example above with $9$, $60$, and $14.$
We want to create a row of factor counts and then take their maximum.
That way, we will get the smallest number divisible by all of them.

We will start by applying `un reduce mul` pervasively.

```uiua
    °/× [9 60 14]
╭─
╷ 1 2 1
  1 2 1
  3 3 2
  3 5 7
        ╯
```

> The 1s are fill values so that the matrix is of a legal shape.
> Multiplying by 1, of course, does nothing and is therefore the
> fill value used by default for `un reduce mul`

Alright. We get back columnar data, so let's transpose it. That
way, each row is a list of factors per number.

```uiua
    ⍉ °/× [9 60 14]
╭─
╷ 1 1 3 3
  2 2 3 5
  1 1 2 7
          ╯
```

And now, we apply `un keep` on each row.

```uiua
    ≡°▽ ⍉ °/× [9 60 14]
Error: Cannot combine arrays with shapes [2] and [3]
```

Oh, yes. There are different amounts of factors between the numbers
so the counts have different shapes. We'll fill in the counts with `0`.

```uiua
    ⬚0≡°▽ ⍉ °/× [9 60 14]
╭─
╷ 1 3 0
  2 3 5
  1 2 7
        ╯
╭─
╷ 2 2 0
  2 1 1
  2 1 1
        ╯
```

Ahh... This won't work. This was a good idea
but we have a problem. The counts do not refer
to the same set of factors. We have calculated
factor counts for each number in isolation.
I'm sure we can do some trickery to fix this but let's first
see if we can fix it at the source.

### Counting occurrences of factors with un where

Looking through the documentation again, we come across this
statement in [where](https://www.uiua.org/docs/where).

>un where (°⊚) will convert indices back into a list of counts

This may be a little confusing but let's see how this interacts with
`un reduce mul`.

```uiua
    °/× 1200
[2 2 2 2 3 5 5]
    °⊚ °/× 1200
[0 0 4 1 0 2]
```

Yes! It does give us the index counts.
It's not immediately obvious, perhaps, so it may help to line
them up with a range that signifies the indices.

```uiua
    °⊚ °/× 1200 ⇡ 6
[0 1 2 3 4 5]
[0 0 4 1 0 2]
```

Now its clear that there are four $2s$, a $3$ and two $5s.$
Let's pick up where we hit a wall in our previous section.
We were looking at $9$, $60$ and $14.$

```uiua
    ⍉ °/× [9 60 14]
╭─
╷ 1 1 3 3
  2 2 3 5
  1 1 2 7
          ╯
```

Let's apply `un where` to each row

```uiua
    ≡°⊚ ⍉ °/× [9 60 14]
Error: Cannot combine arrays with shapes [4] and [8]
```

Same problem as before. We'll fill with 0 so that we extend
each row without affecting the outcome.

```uiua
    ⬚0≡°⊚ ⍉ °/× [9 60 14]
╭─
╷ 0 2 0 2 0 0 0 0
  0 0 2 1 0 1 0 0
  0 2 1 0 0 0 0 1
                  ╯
```

We've established that we want the maximum of the factors

```uiua
    /↥⬚0≡°⊚ ⍉ °/× [9 60 14]
[0 2 2 2 0 1 0 1]
```

and getting them back is applying the opposite of `un where`

```uiua
    ⊚/↥⬚0≡°⊚ ⍉ °/× [9 60 14]
[1 1 2 2 3 3 5 7]
```

and finally their product

```uiua
    /× ⊚/↥⬚0≡°⊚ ⍉ °/× [9 60 14]
1260
```

Hang on a second. Isn't this the solution?

The problem description gives us that $2520$ is the smallest number that can
be divided by each number of the range 1-10. Let's test it

```uiua
    /× ⊚/↥⬚0≡°⊚ ⍉ °/× ⇡₁10
2520
```

Great!

## Solution

To reiterate what we've discovered:

For a collection of numbers, `X`, we can find the smallest number
divisible by them all like so

```uiua
    /× ⊚/↥⬚0≡°⊚ ⍉ °/× X
```

and when provided with the range 1-20 we get the solution to the problem.

```uiua
    /× ⊚/↥⬚0≡°⊚ ⍉ °/× ⇡₁20
232792560
```
