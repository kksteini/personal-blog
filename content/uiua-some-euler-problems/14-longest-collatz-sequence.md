+++
title = "14 - Longest Collatz Sequence"
date = 2026-06-30
weight = 14
[extra]
doclink = "https://projecteuler.net/problem=14"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler", "bigint"]
+++

## Problem

The following iterative sequence is defined for the set of positive integers:

* $n \to n/2$ ($n$ is even)
* $n \to 3n + 1$ ($n$ is odd)

Using the rule above and starting with $13$, we generate the following sequence:
$$13 \to 40 \to 20 \to 10 \to 5 \to 16 \to 8 \to 4 \to 2 \to 1.$$

It can be seen that this sequence (starting at $13$ and finishing at $1$)
contains $10$ terms.
Although it has not been proved yet (Collatz Problem), it is thought that all
starting numbers finish at $1$.

Which starting number, under one million, produces the longest chain?

**NOTE:** Once the chain starts the terms are allowed to go above one million.

<!-- markdownlint-disable MD014 -->

## Solving with brute force

This seems straightforward enough to define in Uiua.
To get the next Collatz number, we'll call it `NC`, we need to check
whether it is odd or even. For odd numbers, we perform `add,1 mul,3` and
`div,2` for even.

```uiua
    NC ← ⨬(+₁×₃|÷₂)=0⊸◿2
    repeat,10 by NC 13
```

And if we try capturing the demo sequence given in the problem?

```uiua
    ⍥₁₀⊸NC 13
[13 40 20 10 5 16 8 4 2 1]
```

Looks like it works.

---

Next we'd like to calculate how many elements there are until we hit $1.$
Let's start by creating a function that generates a sequence until completion.
What if we just collect the next terms until the do-condition is 1?

```uiua
    ⍢(⊸NC|≠1) 13
[13 40 20 10 5 16 8 4 2]
```

Well, since it terminates at $1$, we might as well just add it when the loop ends.

```uiua
    ˜⊂1⍢(⊸NC|≠1) 13
[13 40 20 10 5 16 8 4 2 1]
```

We can now define a function, Collatz Sequence, like so.

```uiua
    CS ← ˜⊂1⍢(⊸NC|≠1)
```

Let's find the longest one out of the first 10

```uiua
    ≡(⧻CS)⇡₁10
[1 2 8 3 6 9 17 4 20 7]
```

Whoah, starting at 9 is pretty good. Let's see it.

```uiua
    CS 9
[9 28 14 7 22 11 34 17 52 26 13 40 20 10 5 16 8 4 2 1]
```

---

Let's find the longest sequence then. Let's start with the first 10 as a test.
We already know that the $9$ produces the longest one.

We'll start by getting the longest one.

```uiua
    ⊸/↥ ≡(⧻CS) ⇡₁10
[1 2 8 3 6 9 17 4 20 7]
20
```

Let's get its index by using `where eq`

```uiua
    ⊚=⊸/↥ ≡(⧻CS) ⇡₁10
[8]
```

We are assuming that there is only one solution so extracting the index
with either `last` or `first` is fine. We'll also need to `add 1` to account for
the 0-index that `where` produces.

```uiua
    +₁⊢⊚=⊸/↥ ≡(⧻CS) ⇡₁10
9
```

---

Now, let's run it over the range of numbers from $1$ to $999 999.$

```uiua
    +₁⊢⊚=⊸/↥ ≡(⧻CS) ⇡₁999999
837799
```

Hoo boi. It gets there but it takes a while.
5 minutes, to be exact.

```uiua
    ⊙◌⍜now(+₁⊢⊚=⊸/↥ ≡(⧻CS) ⇡₁999999)
259.79552698135376
```

That's not good enough.

## Solving with memoization

Every single sequence is going to collapse down to $1$ eventually.
There are probably a lot of funnels that many sequences have in common.
Hell, if any sequence lands on a power of $2$, it will slide all the way down
to $1$ from that.
This means that it might be a good idea to avoid repeat calculations.
What if we could cache them somehow?

If you've read [2 - Even Fibonacci](@/uiua-some-euler-problems/02-even-fibonacci.md#)
then you might remember memoization.
If not, skim the [memo docs.](https://www.uiua.org/docs/memo)

It's probably not a good idea to cache the sequences themselves, after all,
we're just after how long it takes before we reach $1$, not the contents of the
sequence.

### Recursive definition

It would be good if we could come up with a recursive memoized mechanism.
What if we return a number according to this definition?

```pseudocode
def get_collatz_length(n)
    k = get_next_collatz (n)
    if k == 1 
      return 1
    else
      return 1 + get_collatz_length(k)
```

We simply count how many times we needed to get the next Collatz number until
we hit $1.$
Let's set this up in Uiua. Remember, we need to define the signature of the
recursive function. Since we have 1 input, 1 output, we set it to `|1`.

```uiua
GCL ← |1 memo(
  ⊸=1         # Is it 1?
  ⨬(+₁ GCL NC # return 1+GCL NC if not finished
  | 1         # return 1 if previous NC was 1
  )
)
```

Now, did this work? Let's compare with the previous implementation.

```uiua
    ≡GCL⇡₁10
    ≡(⧻ CS) ⇡₁10
[1 2 8 3 6 9 17 4 20 7]
[1 2 8 3 6 9 17 4 20 7]
```

Yup, those match.

---

Let's run the memoized one on the full range now.

```uiua
    +₁⊢⊚=⊸/↥ ≡(⧻GCL) ⇡₁999999
Error: Recursion limit reached. You can try setting UIUA_RECURSION_LIMIT to a higher value. The current limit is 100.
  in GCL ┬×50
```

Darn. Well, let's set that environment variable to something ridiculous and try
again. We get it down to 10 seconds.
I invoked `UIUA_RECURSION_LIMIT=1000 uiua repl` with the following results.

```uiua
    NC ← ⨬(+₁×₃|÷₂)=0⊸◿2
    GCL ← |1 memo(
      ⊸=1         # Is it 1?
      ⨬(+₁ GCL NC # return 1+GCL NC if not finished
      | 1         # return 1 if previous NC was 1
      )
    )

    ⊙◌⍜now(+₁⊢⊚=⊸/↥ ≡(GCL) ⇡₁999999)
10.179513931274414

    +₁⊢⊚=⊸/↥ ≡(GCL) ⇡₁999999
837799
```

#### I wanna run it in the pad goddamn it

The best I can come up with is a hybrid solution that
goes as far as it can down the recursion but always
has the old `CS` as backup when it hits the recursion
limit. This is done by introducing `try`.

I timed one run with `perf` and then ran it without it to verify the results.
This runs in 49 seconds in the pad on my laptop while producing the correct answer.
So it is faster than the pure brute force method
while also not relying on a ridiculous recursion limit.

```uiua
NC ← ⨬(+₁×₃|÷₂)=0⊸◿2
CS ← ˜⊂1⍢(⊸NC|≠1)
GCL ← |1 memo!(
  ⊸=1                    # Is it 1?
  ⨬(⍣(+₁ GCL NC|⧻ CS NC) # return 1+GCL NC if not finished
    # Fall back on CS if recursion limit
  | 1 # return 1 if previous NC was 1
  )
)
+₁⊢⊚=⊸/↥ ≡GCL ⇡₁999999
```
