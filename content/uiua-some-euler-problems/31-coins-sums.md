+++
title = "31 - Coin Sums"
date = 2026-10-12
weight = 31
[extra]
doclink = "https://projecteuler.net/problem=31"
toc = true
pad = "https://uiua.org/pad?src=0_20_0-dev_1__eJxVUj1rGzEY3vUrHrjFxuQqG7J0KJjQbIaCu5Q0JLJO90FkqUi6Xj3GQ9IYBzqFJriU0MFLCx0LIUvX_Av9kiKdHVNpkBDv8_E-r4bGsBn8xRf4yyX-_vaLOwwoRYKjPmjcaZqCHpMDXSkbK4_6GGAffYoBxT5Fn4YbPSYkwVhWWaUKjJgz1SdM2ZkwKUkwNEU9FcrZl2BB8kQKVbgSXFfq5COTtSDjUWTvEMAvbjt-8cevH_xi3o-u9vz8vIsEB0YwJ-BKASuk4E4b5NrEh0CGlgzwl_c9Pz9_Wu2hXf9hDVOFAFMZuDZGcAed55jMoFUE_7yj_ureL7_75Td_8XXL8IZlUU0wXkJIEVqCzls60g0JbETsJohpCIILu4MFlyTBa2uFchWTcoYp-2CfETEfC6d35W1TKYm2Pq8745FfP2AYCruIgwnKh5I5J1Toz4qdcKWcBkNZFwKyso74219-Pg-Id7oGZwFhdAPWsBlULWUrZ1HlmOkaDVOOJPA3j2Em1yt_fdV5RV_0YruHWmYx0Wf-mCrjvJ7WkjlBEvAyxBOctJ7DP6kUF7sqbWBLXcsMk3Y-kgWizadBE1mYlMiDXFO5EqcTxs8aZrLTlDytQirB2s3j-153o0ISvN1SbWdVWTSbdAvhwjGglPjFD_IPx84aiA=="
[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

In the United Kingdom the currency is made up of pound (£) and pence (p).
There are eight coins in general circulation:

- 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p), and £2 (200p).

It is possible to make £2 in the following way:

- 1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p

How many different ways can £2 be made using any number of coins?

## Brute solving in other languages first

_I admit that I don't know a good way to start this problem in Uiua,
without increasing the recursion limit and using repl only
so I'm going to solve it in other languages first to get a better feel for it._

### Ruby + Rust for naive method

I can think of a simple recursive method. We'll consider some coin from
the set of coins. We'll start with the lowest coin.

- -At any time, we can consider higher value coins.
- -At no point can we drop down the coin value we're considering.

We keep a running tally of the value we have.
If, for example, we've considered $30 \times 1\ coins$ and $60 \times 2\ coins$,
we have a running value of $150.$

We will always keep going until we either consider exactly a value of $200$
or go over. If we're exact, we count this as $1$ way.
If we go over, we report back $0.$

This should give us back the count of various ways to get to $200$ without repeats.

```pseudocode
coins = [1,2,5,10,20,50,100,200]
highest_seen = coins[0]

def recurse(reach, highest_seen):
    return 0 if reach > 200
    return 1 if reach == 200

    count = 0
    for coin in coins:
      skip if coin < highest_seen
      count += recurse(reach + coin, coin)

    return count
```

Well. This pseudocode shouldn't be too hard to adapt to ruby.
Let's try it and see if we get the right answer and how much
time it takes.

```ruby
# File: p31_naive.rb
$coins = [1,2,5,10,20,50,100,200]
highest_seen = $coins[0]

def recurse(reach,highest_seen)
  return 0 if reach > 200
  return 1 if reach == 200

  count = 0
  $coins.each do |coin|
    next if coin < highest_seen
    count += recurse(reach + coin, coin)
  end
  count
end

puts recurse(0, 1)
```

Running it and timing it.

```bash
time ruby p31_naive.rb
73682
1,19s user 0,01s system 99% cpu 1,205 total
```

Roughly a second. That's not too bad, I was expecting worse.
I wonder how much speedup is gained from a compiled language, like rust.
The same algorithm:

```rust
const COINS: [u128; 8] = [1, 2, 5, 10, 20, 50, 100, 200];
fn main() {
    let s = add_more(0, 1);
    println!("{}", s);
}

fn add_more(target: u128, highest: u128) -> u128 {
    if target == 200 {
        return 1;
    }
    if target > 200 {
        return 0;
    }

    let mut count = 0;
    for coin in COINS {
        if coin >= highest {
            count += add_more(target + coin, coin);
        }
    }
    count
}
```

Compiling and running.

```bash
❯ cargo build --release
   Compiling thirty_one v0.1.0 (/home/steini/forritun/rust/euler/thirty_one)
    Finished `release` profile [optimized] target(s) in 0.24s
❯ time ./target/release/thirty_one
73682
0,04s user 0,00s system 96% cpu 0,038 total
```

Runs in about 40 ms. This is decent already.

## Dynamic programming

This problem does lend itself to dynamic programming.
If you're unfamiliar and up for some reading then look at
[dynamic programming on Wikipedia](https://en.wikipedia.org/wiki/Dynamic_programming#Computer_science),
maybe the computer science section and the Fibonacci algorithm example.

Otherwise we can simplify the concept.

> Dynamic programming:
> Programs/algorithms that keep track of previously computed sub problems.

For example, if you look back at the [memoization considerations](@/uiua-some-euler-problems/02-even-fibonacci.md#memoization-to-the-rescue)
in the even Fibonacci problem, then that is an example of
dynamic programming. Lower Fibonacci values are treated as
sub-problems for any $F_n = F_{n-1} + F_{n-2}$ and the results are
memoized, that is, the program keeps track of previous computations.

---

So, how can a program remember a previous iteration or a previous sub-problem
for this particular problem?

Well, we can keep an array around, and have it represent ways to get total values.
Each index of the array represents how many ways we have of getting there.
For example, `arr[55]`, will contain how many ways there are to get to $55.$ Simple.

We iteratively update these values as we calculate along. This will make sense
in practice so just keep that loosely in mind.
Of course, there is only $1$ way of getting a value of $0$ and that is by
doing nothing. We start off this array with `arr[0] = 1` and
everything else as $0.$

Now, for every coin, we consider all `arr[x]` it can reach.
For example, with $5$, we'd start at `arr[5]` (we can not get a value less than
$5$ with a $5$ coin). Then, we ask, how many ways could we have gotten to
`arr[5]` via a $5$ coin? Well, we just have to look at how many ways we could've
gotten to the value that is $5$ less. So, update `arr[5]` to be
`arr[5] + arr[5-5] = arr[5] + arr[0]`. We then do this for `arr[6] += arr[1]`,
`arr[7] += arr[2]` and so on. For any `arr[x]` we add `arr[x-5]` to the number
of ways we can get there.

> Personally I needed to see this happen step by step and so, I've
> put down [exactly that in the appendix](/uiua-some-euler-problems/31-coins-sums#explicit-array-operations)
> for the first four coin values and an array of size 10.

### Ruby implementation

We can implement this idea pretty simply.

```ruby
# File: p31.rb
coins = [1,2,5,10,20,50,100,200]

# Initialize the array.
# 201 because 0 ways is included.
ways = Array.new(201,0)
ways[0] = 1 # 1 way to do nothing

# For each coin, slide along the array
# and update.
coins.each do |coin_value|
  (coin_value..200).each do |j|
    ways[j] = ways[j] + ways[j-coin_value]
  end
end

puts ways[200]
```

It runs very fast as well, only $30$ milliseconds.

```bash
time ruby p31.rb
73682
0,02s user 0,01s system 98% cpu 0,029 total
```

## The components in Uiua

Adapting Uiua to this same manner of dynamic programming is hard. The trick is:

> If you're doing dynamic programming, use `fold`

I don't know if this is gospel but it's a good hint I received on the Uiua discord.
There are many ways to implement this in Uiua. Here's what idea I came up with.

We need these components

- -An array of coins
- -An initial array
- *+Keeps track of sub computations
- *+Initialized as [1 0 0 0...0]
- -A sliding matrix maker
- - -Takes coin value and the length of the initial array
- - -Creates rows of arrays, arr, where some `arr[k]` and `arr[k-coin_value]`
    are $1$ and everything else is $0.$

We are then able to take the initial array, and fold each sliding matrix such
that we compute `arr[k] += arr[k-coin_value]` for each coin. If the term
_sliding matrix_ doesn't make sense, don't worry. It'll become clear what
I mean once I start implementing it.

### Initializing the dynamic programming array

We want an array that starts off with `arr[0]` as $1$ and everything else as $0.$
Here are some ways to do it in Uiua.

```uiua
    join 1 reshape 10 0
    ⊂1 ↯ 10 0
[1 0 0 0 0 0 0 0 0 0 0]

    rev unwhere 10
    ⇌ °⊚ 10
[1 0 0 0 0 0 0 0 0 0 0]
```

### Why sliding matrix?

The idea is to generate a sequence of coin distances to slide along the
dynamic array, updating the value of _ways-to-get-to-here_ one by one.

A sliding matrix for the coin value $1$, for a dynamic array size $5$ would
look like this.

```uiua
╭─
╷ 1 1 0 0 0
  0 1 1 0 0
  0 0 1 1 0
  0 0 0 1 1
            ╯
```

A sliding matrix for the coin value $2$, for a dynamic array
size $5$, would look like this.

```uiua
╭─
╷ 1 0 1 0 0
  0 1 0 1 0
  0 0 1 0 1
            ╯
```

The idea for the matrix is that we could use every row as a selector
for advancing the coin count.

I'm going to highlight the first step, as seen in the
[appendix](/uiua-some-euler-problems/31-coins-sums#explicit-array-operations).

```plaintext
Checking for coin 1
arr[1] += arr[0]: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
arr[2] += arr[1]: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
arr[3] += arr[2]: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
arr[4] += arr[3]: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
arr[5] += arr[4]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
arr[6] += arr[5]: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
arr[7] += arr[6]: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
arr[8] += arr[7]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
arr[9] += arr[8]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
arr[10] += arr[9]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
```

When we check the $1$ coin first, we are always updating a distance
of $1$ from the initial 1-way of getting value $0$ by doing nothing.
This gradual filling of $1$ is what we can achieve with the sliding matrix,
selecting the elements and adding the first one to the second.

So, the sliding matrix is there to take care of the selection for us, what
do we then do with each selection?

```uiua
# A snapshot of some selection from a dynamic array
[1 2]

# We want to add the first element to the second
# Maybe, we break apart the two to treat as arguments
# uncouple
°⊟
### 2
### 1

# We add them together with 'on'
# so that the first argument is preserved
⟜+
### 3
### 1

# We join them back together
⊂
### [1 3]
```

This can be simplified.

```uiua
# A snapshot of a selection
[1 2]

# We add along with scan add
\+

### [1 3]
```

#### A single selection operation

Let's imagine we have some snapshot of a running program that
computes, or slides along, a sliding matrix over a _dynamic_ array.
_Snap_ is _some_ row of our sliding matrix.

```uiua
    A    ← [1 2 3 4 5]
    Snap ← [0 0 1 1 0]
```

We've already worked out that `scan add` would work for our selection.
Now we just have to select, transform and put it back. That's just
`under`, wowee!

Since our sliding matrix is just a collection of shifted masking arrays
we can transform the selection with `keep`.

```uiua
    underkeepscanadd Snap A
    ⍜▽\+ Snap A
[1 2 3 7 5]
```

Great. The $2$-index element got added to the $3$-index one.

#### Folding in the sliding matrix

Take the following variables.

```uiua
    A
[1 2 3 4 5]

    M
╭─
╷ 1 1 0 0 0
  0 1 1 0 0
  0 0 1 1 0
  0 0 0 1 1
            ╯
```

I had a hard time understanding `fold` and I'm still not sure I do entirely.
I think of it as a sort of a reducer function though I'm sure that doesn't entirely
capture what it does.

I read `fold F M A` as:

> Use function $F.$
>
> Pass in each row $M_k$ as input to $F.$
>
> Accumulate changes in $A.$

Though, **be very careful with this generalization**. This behaviour changes
based on how many inputs/outputs there are to `F` and you can have more than one
accumulator.

Anyway, our function `F` is going to be `under keep scan add`.
We will use each row of `M` as input and we want changes to
accumulate in `A`.

```uiua
    fold(under keep scan add) M A
    ∧(⍜▽ \+) M A
[1 3 6 10 15]
```

Wow hecking wee! A way most complicated for getting the triangle numbers.

### The sliding matrix

Let's imagine we have the argument $2$ for a $2$ coin.
The selection is `1 0 1`. For an array of length $5$ we want
to create a sliding matrix where this selection is present for
the entire array without overflowing

```uiua
# For some [1 2 3 4 5]
# We want [1 0 1] slid over it
# Resulting in a matrix
╭─
╷ 1 0 1 0 0
  0 1 0 1 0
  0 0 1 0 1
            ╯
```

#### Generating the selection distance

We want a function that creates a selector with
a distance $x.$

```plaintext
[1 1] when x=1
[1 0 1] when x=2
[1 0 0 1] when x=3
etc...
```

Here are ideas on how we can do that in Uiua.

```uiua
    add by rev unwhere 2
    + ⊸⇌ °⊚ 2
[1 0 1]

    join 1 unwhere sub,1 2
    ⊂1°⊚-₁
[1 0 1]
```

And if you dislike `unwhere` you can try

```uiua
    bits add 1 bw pow 2 3
    ⋯ + 1 ˜ⁿ 2 3
[1 0 0 1]
```

#### Generating the matrix

> Here's a short trick worth remembering.
> You can pad an array with $0$s using `anti drop`.
>
> See [drop docs](https://www.uiua.org/docs/drop).

So, if we have an array of length $5$, can't we create a range of that
length and pad the selection distance for each? For the selector `[1 0 1]`
as an example.

```uiua
    range 5 [1 0 1]
    ⇡ 5 [1 0 1]
[1 0 1]
[0 1 2 3 4]
```

For each element of the range, we want to pad the selector to _slide_ it along.

```uiua
    rows,> antidrop ⇡ 5 [1 0 1]
    ≡⌟⌝↘ ⇡ 5 [1 0 1]
Error: Cannot combine arrays with shapes [3] and [7]
```

Oops, we need to fill it with $0s.$

```uiua
    fill0≡⌟⌝↘ ⇡ 5 [1 0 1]
    ⬚0≡⌟⌝↘ ⇡ 5 [1 0 1]
╭─
╷ 1 0 1 0 0 0 0
  0 1 0 1 0 0 0
  0 0 1 0 1 0 0
  0 0 0 1 0 1 0
  0 0 0 0 1 0 1
                ╯
```

Hmm, but that's too big. Each row should be length $5$, not length $7.$
We need to take the difference between the selector and the array.

```uiua
    ⬚0≡⌟⌝↘ ⇡ sub by diplen 5 [1 0 1]
    ⬚0≡⌟⌝↘ ⇡ - ⊸⊙⧻ 5 [1 0 1]
╭─
╷ 1 0 1 0 0
  1 0 1 0 0
            ╯
```

Hmm. Wait, the subtraction is backwards. This is a range of `-2`.

```uiua
    ⬚0≡⌟⌝↘ ⇡ bw- ⊸⊙⧻ 5 [1 0 1]
    ⬚0≡⌟⌝↘ ⇡ ˜- ⊸⊙⧻ 5 [1 0 1]
╭─
╷ 1 0 1 0
  0 1 0 1
          ╯
```

We're off by $1$ here for a length $5$ array. We can increase
the range by $1$ then.

```uiua
    ⬚0≡⌟⌝↘ ⇡ add1 ˜- ⊸⊙⧻ 5 [1 0 1]
    ⬚0≡⌟⌝↘ ⇡ +1 ˜- ⊸⊙⧻ 5 [1 0 1]
╭─
╷ 1 0 1 0 0
  0 1 0 1 0
  0 0 1 0 1
            ╯
```

## Solution

So, we've gone through the basic outlines and components.
Putting those together into a program looks something like this:

```uiua
Array ← ⇌ °⊚ 200 # [1 0 0 0 ... 0]
Coins   ← [1 2 5 10 20 50 100 200]

# Sliding Matrix maker.
# Arguments: array_length coin_value
SM ← (
  ⊙(⊸⧻⊂1°⊚-₁) # Create the selector for the coin value
  ⇡+₁˜-       # Create the range and correct off by one
  ⬚0≡⌟⌝↘      # Pad for each element of range
)

# Create sliding matrices for each coin
# Essentially maps sliding arrays to each coin value.
⬚0∧(SM⧻ Array) Coins

# Flatten these matrices into a huge list
♭₂

# You can throw away null values if you want
# ▽⊸⍜⍉(>0/+)

# Fold the huge list and accumulate
# changes in Array
# Since accumulator should be the last argument we
# call fold with `backward`.
˜∧(⍜▽\+) Array

# The last element is ways to get to 200
⊣
```

### Speed?

$15$ ms is fast enough, I reckon.

```uiua
    ⊙◌⍜now(⊣˜∧(⍜▽\+) Array ♭₂ ⬚0∧(SM⧻ Array) Coins)
0.014999866485595703
```

## Appendix

### Explicit array operations

Wrote a ruby program to show the procedure clearly for an array of 10.

```ruby
coins = [1,2,5,10]
arr = Array.new(11, 0) # For 10 values, need 11 elements
arr[0] = 1 #0th element (doing nothing) is 1 way

puts "Array start"
puts "#{arr}"

coins.each do |coin|
  puts "\nChecking for coin #{coin}"
  (coin...(arr.length)).each do |i|
    arr[i] += arr[i-coin]
    puts "arr[#{i}] += arr[#{i-coin}]: #{arr}"
  end
end
```

When run, it outputs:

```plaintext
Array start
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Checking for coin 1
arr[1] += arr[0]: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
arr[2] += arr[1]: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
arr[3] += arr[2]: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
arr[4] += arr[3]: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
arr[5] += arr[4]: [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
arr[6] += arr[5]: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
arr[7] += arr[6]: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
arr[8] += arr[7]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
arr[9] += arr[8]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
arr[10] += arr[9]: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

Checking for coin 2
arr[2] += arr[0]: [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1]
arr[3] += arr[1]: [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1]
arr[4] += arr[2]: [1, 1, 2, 2, 3, 1, 1, 1, 1, 1, 1]
arr[5] += arr[3]: [1, 1, 2, 2, 3, 3, 1, 1, 1, 1, 1]
arr[6] += arr[4]: [1, 1, 2, 2, 3, 3, 4, 1, 1, 1, 1]
arr[7] += arr[5]: [1, 1, 2, 2, 3, 3, 4, 4, 1, 1, 1]
arr[8] += arr[6]: [1, 1, 2, 2, 3, 3, 4, 4, 5, 1, 1]
arr[9] += arr[7]: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1]
arr[10] += arr[8]: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]

Checking for coin 5
arr[5] += arr[0]: [1, 1, 2, 2, 3, 4, 4, 4, 5, 5, 6]
arr[6] += arr[1]: [1, 1, 2, 2, 3, 4, 5, 4, 5, 5, 6]
arr[7] += arr[2]: [1, 1, 2, 2, 3, 4, 5, 6, 5, 5, 6]
arr[8] += arr[3]: [1, 1, 2, 2, 3, 4, 5, 6, 7, 5, 6]
arr[9] += arr[4]: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 6]
arr[10] += arr[5]: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 10]

Checking for coin 10
arr[10] += arr[0]: [1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 11]
```

You can change the new array to be `201` instead of `11` elements
and add all the coins of the problem to see the entire problem being solved.
Though... only if you really want to. It's a lot of text.
