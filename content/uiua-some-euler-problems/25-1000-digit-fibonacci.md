+++
title = "25 - 1000-digit Fibonacci"
date = 2026-07-16
weight = 25
[extra]
doclink = "https://projecteuler.net/problem=25"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-rc_1__eJxVUD1Lw1AU3d-vuNAloaR5ERwqWmgUoaAOdlM6pH3P8CB5r-RjEDJohVBCCw6VfuBUFRUKXRwK3erov7i_RNJqRbjTPefcc84twBGPHOGFe6QAjoybJRGasYgdI1Q-N3js8cBoB6rpcT80d3YNi1JqMOGKyLgSTSWdVkuYhBTAdgIOvpDCj32whQs1GXGXB3CqWOxxgoMeDm7w4aNu1whAlbEzFR0LCZjeg4npC1TKBOCc-xc8AID1Ht9mGnZHCaaj1dzSDyhmC8yeNvqc9MPbqLA_1YpQBMzuNEyXq7mVfA5Xc4vqmC0q5WTrqQPOJjRndt-1r0fMOlQnOBhsAuZtDpVkIhJKhuBIBp5SbSFdcqJUewutnffzhwC-LteYrdj1XyrMxpiNi9i5BXye1O1aqcoYwWEvn_5U-1Uk_87qcGk14JI2wCLfSFakGA=="
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "bigint"]
+++

## Problem

The Fibonacci sequence is defined by the recurrence relation:

> $F_n = F_{n - 1} + F_{n - 2}$, where $F_1 = 1$ and $F_2 = 1$.

Hence the first $12$ terms will be:

$$\begin{aligned}
F_1 &amp;= 1\\\\
F_2 &amp;= 1\\\\
F_3 &amp;= 2\\\\
F_4 &amp;= 3\\\\
F_5 &amp;= 5\\\\
F_6 &amp;= 8\\\\
F_7 &amp;= 13\\\\
F_8 &amp;= 21\\\\
F_9 &amp;= 34\\\\
F_{10} &amp;= 55\\\\
F_{11} &amp;= 89\\\\
F_{12} &amp;= 144
\end{aligned}$$

The $12$th term, $F_{12}$, is the first term to contain three digits.
What is the index of the first term in the Fibonacci
sequence to contain $1000$ digits?

## Naive attempt

We are being asked to provide an index for the first Fibonacci sequence to contain
a $1000$ digits. Maybe the IEEE 754 double precision is good enough to suss
that out.

### A loop and index dance

The `do` loop has two parts, loop condition and loop body, that act on the
same input.
With that in mind, we decide what we want and in what order it would be useful.

Since we are being asked to keep track of an index, but the index isn't used
anywhere in the calculations, we'll put that at the end.

We'll have three arguments where some $F_{k-1}$ and $F_{k-2}$
are the first two.
We can fudge the index parameter such that $F_{k-1}=F_N$ when $index = N.$
The important part is that we are calculating the recurrence relation.

> Since we are fixing the iterator and the first argument to represent
> the n-th Fibonacci we have to initialize the loop with the 2nd argument as $F_0=0$

This is a lot to take in so here are alternate
explanations, and examples, of the arguments.

```plain
# Arguments
F2 F1 iterator

# After first run
F2+F1 F1 iterator+1

# Initial values
1 0 1

# After first run
2 1 2

# Values after 5 runs
8 5 6
```
---

For the loop body, we will update our iterator by simply reaching for it with
`dip dip add,1`.
Then, for the recurrence relation, we add $F_{k-1} + F_{k-2}$ and modify our
add function
to produce $F_{k-1}+F_{k-2}$ and $F_{k-1}$ for the next iteration.
We can use either `off` or `on` for that, I never remember.

```uiua
# on
    [⊙⊙+₁ ⟜+ 5 3 5]
[5 8 6]

# off
    [⊙⊙+₁ ⤚+ 5 3 5]
[8 5 6]
```

It's `off`.

Alright, we have our loop body. Next up, loop condition.

---

We need to check whether the first argument is a number
that is large enough to have 1000 digits.

Well, we can just use scientific notation.
`1e0` for $1$ digit, `1e9` for $10$ digits and so on.
We see, in the example, that `F_12` is the first one to have $3$ digits.

The loop condition becomes `<1e2`.

```uiua
    LoopBody      ← ⊙⊙+₁ ⤚+
    LoopCondition ← <1e2
    ⍢(LoopBody|LoopCondition) 1 0 1
12
89
144
```

We are not interested in the results, so we can pop twice to get the iterator.

```uiua
    ◌◌⍢(LoopBody|LoopCondition) 1 0 1
12
```

Nice. Our program agrees with the example.
We'll just update our condition to be `1e999`.

```uiua
    LoopCondition ← <1e999
    ◌◌⍢(LoopBody|LoopCondition) 1 0 1
1477
```

Uh, that is **not the correct answer**. Maybe double precision isn't accurate enough?
Let's remove `pop pop` and see what we have.

```uiua
    ⍢(LoopBody|LoopCondition) 1 0 1
1477
130698922376339870000000000...<"truncated a bunch of zeroes">
∞
```

Wait, so we go from a very large number to $\infty$ in one step.
These numbers are too large then?

```uiua
    1e999
∞
```

Hmm... That won't work. We'll need something bigger!

## Solution

### Simple Big Integer

Let's use our simple big integer module as seen previously in [chapter 20](@/uiua-some-euler-problems/20-factorial-digit-sum.md#module-time).
We'll narrow it down to the relevant parts.

```uiua
┌─╴SBI
  AddNotFin ← /↥ >9
  RemZer    ← ⨬(∘|↘¯1)=0⊸⊣
  Add       ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)
└─╴
```

We'll keep the same strategy but adjust accordingly.
The only difference is the loop condition since our representation
of BigInts is a number array.

```uiua
    LoopCondition ← <1000 ⧻
    LoopBody ← ⊙⊙+₁ ⤚SBI~Add
    ◌◌⍢(LoopBody|LoopCondition) [1] [0] 1
4782
```

### How fast?

Fast enough. I'm happy.

```uiua
    ⊙◌⍜now(◌◌⍢(LoopBody|LoopCondition) [1] [0] 1)
0.33788633346557617
```
