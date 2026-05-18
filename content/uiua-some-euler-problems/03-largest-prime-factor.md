+++
title = "3 - Largest Prime Factor"
date = 2026-05-18
weight = 3
[extra]
doclink = "https://projecteuler.net/problem=3"
toc = false

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "prime factor"]
+++

*This is a first draft and I've published it. Wowee reckless*.

## Problem

The prime factors of $13195$ are $5, 7, 13$ and $29$.
What is the largest prime factor of the number $600851475143$?

## Solving with proper divisors

### Modulus as means to proper divisors

*[Previous modulus basics](@/uiua-some-euler-problems/01-multiples-of-3-or-5.md#modulo)*

Proper divisors of $N$ we define to be any $K < N$ such that $mod\ K$ is $0$;
that is to say, $K$ divides $N$.

Let's determine this with Uiua and get familiar with pervasiveness at the same time.
What we've seen before is something like `mod X Y` where $X$ and $Y$ are
scalars (integers). If the result is $0$ then $X$ divides $Y$ cleanly.

What if $X$ is an array of numbers instead?

```uiua
 ◿ [1 2 3 4 5 6 7 8 9 10] 60
[0 0 0 0 0 0 4 4 6 0]
```

We get back an array. For every number $n$ in $X$, Uiua computes
$mod\ n\ Y$.
How can we gather the numbers in $X$ which cleanly divide $Y$?

Look at [the off documentation](https://uiua.org/docs/off).
When we calculate the modulus we would like to keep the $X$ array,
the first argument to `mod`. Then we ask the question `eq 0` to the
modulus for us to `keep`.

```uiua
    ⤚◿ [1 2 3 4 5 6 7 8 9 10] 60
[1 2 3 4 5 6 7 8 9 10]
[0 0 0 0 0 0 4 4 6 0]
```

then eq 0

```uiua
    =0⤚◿ [1 2 3 4 5 6 7 8 9 10] 60
[1 2 3 4 5 6 7 8 9 10]
[1 1 1 1 1 1 0 0 0 1]

```

and finally keep

```uiua
    ▽=0⤚◿ [1 2 3 4 5 6 7 8 9 10] 60
[1 2 3 4 5 6 10]
```

Checking the range 1 to 10 feels quite arbitrary.
It might be more useful to get all divisors.
Given 60, we want a range of useful numbers to test.
Well, why not 0-59?

```uiua
    ⊸⇡ 60
60
[0 1 ...truncated 58 59]
```

Now we can use the same method as above to see what numbers on the range 0-59
divide 60.

```uiua
    ▽ =0 ⤚◿ ⊸⇡ 60
[1 2 3 4 5 6 10 12 15 20 30]
```

> 60 has a lot of factors. It is a so-called highly composite number.
> See: [Highly Composite Number on Wikipedia](https://en.wikipedia.org/wiki/Highly_composite_number)

By doing this, we have found all positive factors of 60 less than itself, or
proper divisors. Let's make this a function and test
some numbers

```uiua
    PD ← ▽ = 0 ⤚◿ ⊸⇡

    PD 60
[1 2 3 4 5 6 10 12 15 20 30]

    PD 59
[1]

    PD 57
[1 3 19]
```

> BTW, there is a more Uiua way to compute proper divisors.
> See *[alternate proper divisors](@/uiua-some-euler-problems/03-largest-prime-factor.md#alternate-proper-divisors)*
Nice. $60$ is as before, highly composite.
We tested $57$ and it is divisible by $1$, $3$, and $19$.
Most interesting is $59$. The only divisor found is $1$.

### Proper divisors as means to primality

> A prime number is a number that is only divisible by
> 1 and itself
>
> -Albert Einstein (possibly misattributed)

When we tested $59$ for proper divisors we only got
back $1$. We know that $1$ divides every number and
that every number divides itself.
Since `PD N` excludes N we can use it as a prime
checker. It is exactly where $1$ is the only
proper divisor or `=1 len PD N`. Let's get all primes
below 50. We'll start by applying our primality check
to the range 0-49.

```uiua
    ≡(=1 ⧻ PD) ⇡50
[0 0 1 1 0 1 ...truncated 0 0]
```

When we have some condition applied to a range that starts from 0,
we can use `where` to get back the numbers that produced
$1$s. I recommend reading
[the where docs](https://uiua.org/docs/where) to understand why.

```uiua
    ⊚ ≡(=1 ⧻ PD) ⇡50
[2 3 5 7 11 13 17 19 23 29 31 37 41 43 47]
```

Yup, that's a list of primes.
Let's declare a prime checking function

```uiua
IsPrime ← =1 ⧻ PD
```

> This is quite slow BTW, but we'll examine faster methods
> for checking primes in a later section

### Doubling down on PD for prime factors

Recall the example given by the problem description.
The prime factors of $13195$ are $5, 7, 13$ and $29$.

We can use `PD` twice to get and filter factors by primality. First, the
proper divisors

```uiua
    PD 13195
[1 5 7 13 29 35 65 91 145 203 377 455 1015 1885 2639]
```

Then, we filter on those who are prime

```uiua
    ▽ ⊸≡IsPrime PD 13195
[5 7 13 29]
```

Now, solving the problem is simply getting the largest one

```uiua
    /↥ ▽ ⊸≡IsPrime PD 13195
29
```

Great. Now lets try it on the real deal

```uiua
    /↥ ▽ ⊸≡IsPrime PD 600851475143
Error: Array of 600851475143 8-byte elements would be too large (4806811.801 MB)
  at 1:16
```

Oh. That's not good.
We're trying too hard. Maybe we can reduce the search space somehow?

### Reducing the search space

How far do we have to look to find the largest possible prime factor?
There are some observations we can make.
Let's take a look at `PD 60`.

```uiua
    PD 60
[1 2 3 4 5 6 10 12 15 20 30]
```

If we consider **all** the factors then that includes $60$.
What you may notice then is that the factors come in pairs that multiply to 60.

$$ 1 * 60$$
$$ 2 * 30$$
$$ 3 * 20$$
$$ 4 * 15$$
$$ 5 * 12$$
$$ 6 * 10$$

> I don't have a mathematical proof for this pair-wise relationship
> and so it might be a good exercise to convince
> yourself of this being true.

These pairs result in us being able to get at larger factors with
dividing 60 by the smaller ones. Let's reduce the range of PD by half and test this

```uiua
    PDH ← ▽ =0 ⤚◿ ⇡ ⌈⊸÷2
    PDH 60
[1 2 3 4 5 6 10 12 15 20]
```

OK, we have the factors, let's now divide 60 by each factor and see if we get back
$60\ 30\ 20\ 15\ 12\ 10$, the counterparts of the pairs.

```uiua
[60 30 20 15 12 10 6 5 4 3]
```

Well... we do get them back but with some extra.
Dividing the range by half does not result in us getting the
halfway point of the proper divisors. So what does?

Let's take a look at some factors for a couple of numbers. I'll use a slightly
altered version of `PD` to get all divisors, `AD = join by PD`.

```uiua
    AD 12
[1 2 3 4 6 12]

    AD 16
[1 2 4 8 16]

    AD 25
[1 5 25]

    AD 36
[1 2 3 4 6 9 12 18 36]

    AD 14
[1 2 7 14]
```

Some of these are fine, but didn't we say that all factors come in pairs?
What's happening with 16, 25 and 36? They all have an
odd number of proper divisors.
Well, there sort of **is** a pair there. It is exactly the midpoint.
$16$, $25$, and $36$ are square numbers. Let's look at 16

$$1 * 16$$
$$2 * 8$$
$$4 * 4$$

For the square numbers, if we pair them up, the exact square root
is always as far as we would like to go to get the larger pair-wise factors.

$$1 * 25$$
$$5 * 5$$

That last pair is the square.
If we look back at the pairs of $60$, we notice that $6$
is as far as we would've like to go.

```uiua
    ÷ [1 2 3 4 5 6] 60
[60 30 20 15 12 10]
```

So, is it the case for any number that the square is where we want to stop?
The square root of $60$ is roughly $~7.75$.
Since we don't want to go over this number we can floor it to $7$.
If we would've checked only up to 7, then yes, 6 would've been the last divisor
to show up for the range up to 7.

Let's then create a function, `PDS` that gets half of the proper divisors by
limiting the range to the square root. We will start the range from 1 so that
it is inclusive

```uiua
PDS ← ▽ =0 ⤚◿ ⇡₁ ⌊ ⊸√

    PDS 14
[1 2]
    ÷ ⊸PDS 14
[14 7]

    PDS 60
[1 2 3 4 5 6]
    ÷ ⊸PDS 60
[60 30 20 15 12 10]

    PDS 25
[1 5]
    ÷ ⊸PDS 25
[25 5]
```

We now have a way to get at all the factors for a number without consuming the
whole range up to that number.
Let's try again with $13195$

We start with getting the `PDS` of $13195$

```uiua
    PDS 13195
[1 5 7 13 29 35 65 91]
```

The second part would be dividing that range with $13195$.
That is just

```uiua
    ÷ ⊸PDS 13195
[13195 2639 1885 1015 455 377 203 145]
```

The original range is consumed but we can preserve it with either `off` or `on`.
Let's use `off`

```uiua
    ⤚÷ ⊸PDS 13195
[1 5 7 13 29 35 65 91]
[13195 2639 1885 1015 455 377 203 145]
```

Notice how $13195$ itself is in there. We'll `drop` it.
Good thing we used `off` so that it is part of the first argument

```uiua
    ↘₁ ⤚÷ ⊸PDS 13195
[1 5 7 13 29 35 65 91]
[2639 1885 1015 455 377 203 1
```

Now we want to join these, run a primality check, keep the prime factors and return
the largest.

```uiua
# Recall IsPrime
    IsPrime ← =1 ⧻ PD

# Join these
    ⊂ ↘₁ ⤚÷ ⊸PDS 13195
[2639 1885 1015 455 377 203 145 1 5 7 13 29 35 65 91]

# Keep if prime
    ▽ ⊸≡IsPrime ⊂ ↘₁ ⤚÷ ⊸PDS 13195
[5 7 13 29]

# Return the largest
    /↥ ▽ ⊸≡IsPrime ⊂ ↘₁ ⤚÷ ⊸PDS 13195
29
```

OK. We got the example right again. Have we optimized this enough for it to work
for the big guns?

```uiua
    /↥ ▽ ⊸≡IsPrime⊂ ↘₁ ⤚÷ ⊸PDS 600851475143
Error: Array of 8462696833 8-byte elements would be too large (67701.575 MB)
```

Darn. So the square of $600851475143$ is too big?
Well, no. Calling `PDS` on it works.

```uiua
    PDS 600851475143
[1 71 839 1471 6857 59569 104441 486847]
```

and so does

```uiua
    ÷ ⊸PDS 600851475143
[600851475143 8462696833 716151937 408464633 87625999 10086647 5753023 1234169]
```

Hang on. Our error message had to do with $8462696833$ which is one of our factors.
Well of course! We are still using the full range primality check. Let's rewrite
our previous `IsPrime` such that it uses `PDS` instead of `PD`.

```uiua
    IsPrime ← =1 ⧻ PDS
```

> This is fine since our primality check insists that there is only
> two factors, 1 and the number itself. PDS only gives back half of the
> factors whereas PD would exclude the number itself only.
> For a prime number, in both cases only [1] is returned.
> An edge case you might think to look at is a number with three
> proper divisors since PDS goes halfway. In those cases, f.x. PDS 25,
> two divisors are returned.

The solution is therefore

```uiua
    /↥ ▽ ⊸≡IsPrime⊂ ↘₁ ⤚÷ ⊸PDS 600851475143
6857
```

## Solving the Uiua way

### The documentation is a gold mine

Were you, a more experience Uiua user, screaming internally for a
certain something the whole previous section?
If not, I would like you to visit [the uiua idioms](https://www.uiua.org/docs/idioms).
It's right there, the prime factorization of a number.

### A beautiful built-in

What we did by getting all the proper divisors and then filtering on the
primes is equivalent to doing a prime factorization of a number and then
removing the duplicates.

Since we care only about the largest prime factor, we simply
prime factorize

```uiua
    °/× 600851475143
[71 839 1471 6857]
```

and then take the largest one

```uiua
    /↥ °/× 600851475143
6857
```

There. That's all it took to solve Problem 3.

## Appendix

### Alternate Proper Divisors

Whenever we want to keep elements of an array, by some condition, on a range
that starts on 0, we should consider using `where`.

Since `where` gives back indices of non zero elements we don't have to keep
the original range. It pops back out.

Therefore, we can rewrite the proper divisors from

```uiua
    ▽=0⤚◿⊸⇡ 60
[1 2 3 4 5 6 10 12 15 20 30]
```

to

```uiua
    ⊚=0◿⊸⇡60
[1 2 3 4 5 6 10 12 15 20 30]
```
