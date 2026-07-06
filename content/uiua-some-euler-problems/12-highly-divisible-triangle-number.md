+++
title = "12 - Highly Divisible Triangle Number"
date = 2026-06-24
weight = 12
[extra]
doclink = "https://projecteuler.net/problem=12"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "triangle numbers"]
+++

## Foundation

### What are the triangle numbers?

The triangle numbers, $1,3,6,10,...$, are called that because they represent
a specific kind of triangle.

Imagine you're stacking, or ordering, balls into a 2D triangle.
Start with a triangle of size $1.$
You can make ever larger triangles by repeating the following procedure.

* -Add rows beneath your triangle
* * +It's still a triangle.
* * +Each successive row needs one more ball than the row before it.

Here's ASCII art that demonstrates this process.

```plain
   *     = 1

   *
  * *    = 3

   *
  * *    = 6
 * * *

   *
  * *
 * * *   = 10
* * * *
```

### How to generate them in Uiua?

#### Range

The first triangle number is $1.$
For each successive term we add the current index (1-indexed) to the previous value.
If you look back at the ASCII representation this becomes obvious.
We always tack on a row of balls beneath the previous triangle. The row we tack
on is always equal to the index.

Therefore, we can use `scan` to accumulate the triangle numbers.
Since this is 1-indexed we start with `range,1`.

```uiua
    scan add range,1 10
    \+ ⇡₁10
[1 3 6 10 15 21 28 36 45 55]
```

#### Iteratively

We can define a function, $X$, such that it acts on two numbers.
Its first argument is the addition iterator. It'll start at $1.$
The second argument is the cumulative sum. That'll start at $0.$

We create two new arguments with `fork`:

* -`add,1`, which creates a new first argument, the iterator
* -`add` which creates a new second argument, the cumulative sum

This way, repeatedly calling `X` on itself will advance the iterator
and create the next triangle number.

Let's see it in action.

```uiua
    X = fork add,1 add
    X ← ⊃+₁ +

    [X 1 0]
[2 1]
    [X X 1 0]
[3 3]
    [X X X 1 0]
[4 6]
    [X X X X 1 0]
[5 10]
```

Yup. We see the first four triangle numbers, $1,3,6,10$, in there.

## Solution

### A sad brute force

Here's a program.
It uses the [proper divisor check](@/uiua-some-euler-problems/03-largest-prime-factor.md#alternate-proper-divisors)
as seen in chapter 3.
Then a good ol' do loop

```uiua
    Cond ← >500⧻⊚=0◿⊸⇡
    X    ← ⊃+₁ +

    ◌⍢(X|¬ Cond◌) 1 0

76576500
```

This one ran out of memory in the pad.

It took around 20 minutes to crunch this in the repl on my laptop.
That is toooooooo slow.
The problem is clearly that the condition is using the range parameter,
creating ever larger ranges.

### Divisor function formula

When researching better methods, I looked to see if there was a function that
could count the number of divisors for a number instead of finding them all and
counting them.

Turns out, there is the **divisor function** and its
[prime power property](https://en.wikipedia.org/wiki/Divisor_function#Formulas_at_prime_powers).

#### Understanding the formula

If you have low math literacy, like myself, this is daunting.

$$\prod_{i=1}^r (a_i + 1)$$

However, that symbol is really just a way of saying "multiply these together".
It's just a loop that keeps a running product.

The $i=1$ is the start of the loop and $r$, the number of distinct prime factors,
is the end.

Let's use this formula to get a count of how many proper divisors $60$ has for example.
Running `un reduce mul 60` yields `[2 2 3 5]`. We'll represent it
mathematically like so.

$$2^2 \times 3^1 \times 5^1 = 60$$

For each prime factor $p_i$, that is $2,3$ and $5$, we take note of their
exponents $a_i$ in $p_i^{a_i}$, that is $2,1$ and $1.$
We also see that the count of prime factors is $r=3.$

Therefore, with $i=1$, $r=3$ and $a_1=2,\ a_2=1,\ a_3=1$ we get the
product

$$\prod_{i=1}^3 (a_i + 1)$$
$$ = (a_1 + 1)\times(a_2 + 1)\times(a_3 + 1) $$
$$ = (2+1)\times(1+1)\times(1+1)$$
$$ = 3 \times 2 \times 2 = 12 $$

And does that match the amount of proper divisors for $60$?

```uiua
    by length add,1 where=0 mod by range,1 60
    ⊸⧻ +₁ ⊚=0 ◿ ⊸⇡₁60
[1 2 3 4 5 6 10 12 15 20 30 60]
12
```

Yes. It does!

#### Implementing the formula in Uiua

We'll start with getting the prime factors.

```uiua
    °/× 60
[2 2 3 5]
```

We can use `un keep` to get the values of the exponents since our prime factors
are sorted.

```uiua
    °▽ °/× 60
[2 3 5]
[2 1 1]
```

We can throw away the factors, with `dip pop`, since we only care about the exponents.

```uiua
    ⊙◌°▽ °/× 60
[2 1 1]
```

Now, the product formula was $(a_i + 1)$ so we must `add,1` to the list of exponents.

```uiua
    +₁⊙◌°▽ °/× 60
[3 2 2]
```

Finally, multiplying it all together.

```uiua
    /×+₁⊙◌°▽ °/× 60
12
```

#### Solving with the new and improved formula

We substitute the condition check with our new and improved formula.

```uiua
    Cond ← /×+₁⊙◌°▽ °/×
    X    ← ⊃+₁ +
```

We then run this as before.

```uiua
    ◌⍢(X|<500 Cond◌) X 1 0
76576500

    ⊙◌⍜now(◌⍢(X|<500 Cond◌) X 1 0)
0.02476668357849121
```

That's the right answer and **only** 60000 times faster than our
previous attempt at 20 minutes.
