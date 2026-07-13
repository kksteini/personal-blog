+++
title = "6 - Sum Square Difference"
date = 2026-06-03
weight = 6
[extra]
doclink = "https://projecteuler.net/problem=6"
toc = true
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxVjzFOxEAMRXufwlKKLVZDsg0FDQXStlukoJ5sPGSkmcxij7ffIIGEKLgCh6DmLnMSlAQJ6L6eZb_vCvfKeSDGnrL1QVCIbqBCO2p35aVWr9ZIimRIA7E5ceoCRambayMajTyqZTK9d46YxiPV0Go8uHbhguX5HestlstXmSZY6cG1GtfRyrHeAlS4T4yjxo5YcGd2TQPl5aNMlzlBhXc2HDXYTLhKMTkUjbK07ee4kB9xOhNjHgjZjg8E5fXpn_xvyfn4_WDzRuYFz2g7SUEz4e9bt1DePg18A3GPb54="

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

The sum of the squares of the first ten natural numbers is,
$$1^2 + 2^2 + ... + 10^2 = 385.$$
The square of the sum of the first ten natural numbers is,
$$(1 + 2 + ... + 10)^2 = 55^2 = 3025.$$
Hence the difference between the sum of the squares of the first ten natural
numbers and the square of the sum is $3025 - 385 = 2640$.
Find the difference between the sum of the squares of the first one hundred
natural numbers and the square of the sum.

## Other programming languages

I don't really know what to say about this problem.
I think this is simple for computers
but very tedious for humans.

Certainly it is a trivial problem for Uiua and
easy for many other programming languages too.

I'll just demonstrate quickly with a few programs before we
solve it in Uiua.

### Ruby

Ruby has a way of instantiating ranges with `(from..to)`.
With the `sum` and `map` methods on ranges/arrays,
and raising to the second power with `num ** 2`,
we can solve this problem.
A program might look like this.

```ruby
sum_of_squares = (1..10).map{|v|v**2}.sum
square_of_sums = (1..10).sum**2
puts square_of_sums - sum_of_squares
```

### Python

Very similar to Ruby but uses [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
because why not?

```python
sum_of_squares = sum([i**2 for i in range(1, 101)])
square_of_sums = sum(range(1, 101))**2
print(square_of_sums - sum_of_squares)
```

### Lua

I claim this is trivial for most programming languages.
To back that up I searched for a *random programming
language* and got handed Lua.
I have no experience with Lua.

I read a little on the language but didn't find
any obvious mappers or magic methods like `sum`.

Here's how I decided to tackle this problem more directly.

```lua
local range_sum = 0
local squares_sum = 0
for i=1,100 do
    range_sum = range_sum + i
    squares_sum = squares_sum + i^2
end

print(range_sum^2 - squares_sum)
```

#### A very optional exercise 1

Pick a programming language, other than Uiua, and try solving this problem.

## Solving it with Uiua

Let's solve first for the example range of 1-10.

```uiua
    range,1 10
    ⇡₁10
[1 2 3 4 5 6 7 8 9 10]
```

Raising all numbers to the power of 2

```uiua
    pow,2 ⇡₁10
    ⁿ₂ ⇡₁10
[1 4 9 16 25 36 49 64 81 100]
```

and summing them up.

```uiua
    /+ ⁿ₂ ⇡₁10
385
```

Tacking on another range, but this time summing right away

```uiua
    /+ ⇡₁10 /+ ⁿ₂ ⇡₁10
385
55
```

raising to the second power

```uiua
    ⁿ₂/+ ⇡₁10 /+ ⁿ₂ ⇡₁10
385
3025
```

and subbing.

```uiua
    - ⁿ₂/+ ⇡₁10 /+ ⁿ₂ ⇡₁10
¯2640
```

Whoops, nothing `backward` won't fix.

```uiua
    ˜- ⁿ₂/+ ⇡₁10 /+ ⁿ₂ ⇡₁10
2640
```

And that's the answer.

## Solution

```uiua
    ˜- ⁿ₂/+ ⇡₁100 /+ ⁿ₂ ⇡₁100
25164150
```

### How fast?

Uiua is optimized for array operations and the math we're doing isn't crazy.
We should expect this to be blazing fast.

```uiua
    ⊙◌⍜now(˜- ⁿ₂/+ ⇡₁100 /+ ⁿ₂ ⇡₁100)
0.000020265579223632813
```

Yup. Near instant.

### Make it pretty

The solution we have is straightforward.
However, one thing we can take note of is that the same range is created twice.
When we see that happen, often we can use `fork` to run two
operations on the same input.

```uiua
    fork(/add pow,2|pow,2 /add) range,1 10
    ⊃(/+ⁿ₂|ⁿ₂/+) ⇡₁10
3025
385
```

The fork outputs two arguments. We simply sub them.

```uiua
    -⊃(/+ⁿ₂|ⁿ₂/+) ⇡₁100
25164150
```
