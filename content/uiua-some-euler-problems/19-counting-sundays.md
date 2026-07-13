+++
title = "19 - Counting Sundays"
date = 2026-07-08
weight = 19
[extra]
doclink = "https://projecteuler.net/problem=19"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

You are given the following information, but you may prefer to do some research for yourself.

* -1 Jan 1900 was a Monday.

```plain
Thirty days has September,
April, June and November.
All the rest have thirty-one,
Saving February alone,
Which has twenty-eight, rain or shine.
And on leap years, twenty-nine.
```

* -A leap year occurs on any year evenly divisible by $4$,
   but not on a century unless it is divisible by $400$.

How many Sundays fell on the first of the month during the twentieth century
(1 Jan 1901 to 31 Dec 2000)?

## The easy way out

A part of me wants to skip this problem for Uiua,
I know how easy this is in something like Ruby.

```ruby
require 'date'
date = Date.new 1901,1,1
sundays = 0

until date.year == 2001
  sundays += 1 if date.sunday?
  date = date.next_month
end

puts sundays
```

I can only imagine this is as easy in python.
Well... We just have to do it..

## The hard way in

What if we just go for it? What if we just don't use a library?
What if we put a sob emoji right here? 😭

### Encoding days

We're allowed any research and according to mine, 1st of January 1901 is a Tuesday.
Let's start by defining our data.
We'll encode our days from 0-6.
`0: Sunday, 1: Monday ... 5: Friday, 6: Saturday`.

**Keep in mind that 1901 will start on $2$.**

### Leap year check

We can get away with only considering if a year
is divisible by $4$ for this particular problem. Let's not complicate it with
the century caveat since we know the range we're checking.
We go from $1901$ until $2000$ which is divisible by $400.$

Just `eq0 mod4` will do ye'.

### Breaking the problem down

What if we consider a year at a time?
The information we would need, for counting how many Sundays are in a year,
is whether the year is a leap year and on what day the year starts.

Our function signature might be something like:

```plain
F is_leap start_day 
```

We would want a list of calculations for some selected years to apply it to:

```plain
# List of [is_leap start_day]
[
  [0 2]
  [0 3]
  [0 4]
  [1 5]
  [0 1]
  ...
]
```

I have no idea if these numbers are correct, so let's create them first.

#### Generating the list

For brevity, let's pretend we only need to check from $1901$ to $1909.$

```uiua
    ⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
```

Which ones are leap years?

```uiua
    =0 ⊸◿4⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
[0    0    0    1    0    0    0    1    0   ]
```

We know that $2$ is the starting day of $1901.$
How can we get the sequential years?

Let's say we want to find the starting day of $1902.$
A straightforward way would be to take `mod,7` of `add 365 2`, that is to say,
the number of days in $1901$ added to its starting day.

So, we'll create yet another array. This one represents how many days
there are in each given year. Let's start by creating an array of $365s$ equally
as long with `bw reshape 365 by len`.

```uiua
    ˜↯ 365⊸⧻ =0 ⊸◿4⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
[0    0    0    1    0    0    0    1    0   ]
[365  365  365  365  365  365  365  365  365 ]
```

We can correct the day count with `by add` which uses the leap year information
in the preceding argument.

```uiua
    ⊸+ ˜↯ 365⊸⧻ =0 ⊸◿4⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
[0    0    0    1    0    0    0    1    0   ]
[365  365  365  366  365  365  365  366  365 ]
```

---

We're almost ready to `scan` along.
We need to add the starting day. We can `join 2` for that.
Let's also `drop` the last element since we
don't need to know how many days are in $1909$, we aren't interested in the
starting day of $1910$ after all.

```uiua
    drop`1 join2 ⊸+ ˜↯ 365⊸⧻ =0 ⊸◿4⇡₁₉₀₁1909
    ↘¯1⊂2⊸+ ˜↯ 365⊸⧻ =0 ⊸◿4⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
[0    0    0    1    0    0    0    1    0   ]
[2    365  365  365  366  365  365  365  366 ]
```

Let's `scan add` and then `mod 7`.

```uiua
    ◿7 \+ ↘¯1⊂2⊸+ ˜↯ 365⊸⧻ =0 ⊸◿4⇡₁₉₀₁1909
[1901 1902 1903 1904 1905 1906 1907 1908 1909]
[0    0    0    1    0    0    0    1    0   ]
[2    3    4    5    0    1    2    3    5   ]
```

We can drop the years, remove `by` and `bw join` the `rows` of the two arrays to
get the list we want for `F`.

```uiua
    ≡˜⊂◿7 \+ ↘¯1⊂2⊸+ ˜↯ 365⊸⧻ =0 ◿4⇡₁₉₀₁1909
╭─
╷ 0 2
  0 3
  0 4
  1 5
  0 0
  0 1
  0 2
  1 3
  0 5
      ╯
```

This is a lot to process so let's bind it to a variable.

```uiua
LeapAndStart ← ≡˜⊂◿7 \+ ↘¯1⊂2⊸+ ˜↯ 365⊸⧻ =0 ◿4⇡₁₉₀₁1909
```

#### Calculating a year at a time

Look at the time constants in the [constants](https://www.uiua.org/docs/constants) documentation.
We have `MonthDays` and `LeapMonthDays`.
We've already done one reduction trick, so let's throw in another.

We know that our inputs are going to be `is_leap start_day`.
Let's play around with `1 2` as the first input.

Let's select the corresponding days of the month list depending on the leap-year-ness.
A `switch` ought to do it.

```uiua
    ⨬(MonthDays|LeapMonthDays) 1 2
2
[31 29 31 30 31 30 31 31 30 31 30 31]
```

Now, we employ the same trick as before.
We'll `bw join` the $2$ at the front and drop the last month.

```uiua
    ↘¯1˜⊂ ⨬(MonthDays|LeapMonthDays) 1 2
[2 31 29 31 30 31 30 31 31 30 31 30]
```

Since we defined Sunday to be $0$, we just have to `scan add`
and `mod 7` before counting up them zeroes with `len where eq 0`.

```uiua
    ◿₇ \+ ↘¯1˜⊂ ⨬(MonthDays|LeapMonthDays) 1 2
[2 5 6 2 4 0 2 5 1 3 6 1]
```

And counting them:

```uiua
    ⧻⊚ =0 ◿₇ \+ ↘¯1˜⊂ ⨬(MonthDays|LeapMonthDays) 1 2
1
```

So, any leap year that starts on Tuesday should have one Sunday at the first of
some month.
Well, 2008 is a leap year that starts on a Tuesday
and only June of that year starts on a Sunday 1st.

We have a candidate for `F` then.

```uiua
    F ← ⧻ ⊚=0◿₇ \+ ↘¯1˜⊂ ⨬(MonthDays|LeapMonthDays)
```

How many Sundays fell on the first between 1901 and 1909?

```uiua
    ≡(F°⊂) LeapAndStart
[2 1 3 1 2 2 2 2 1]

    /+≡(F°⊂) LeapAndStart
16
```

Let's further verify `F` by selecting an interesting year, like 1903. If we
pick up a calendar and skim through, we can verify
if it has 3 premium Sundays as promised.
It does indeed have three premium Sundays: February, March and November 1st.

## Solution

### Without datetime

Recall what we derived:

```uiua
    F            ← ⧻ ⊚=0◿₇ \+ ↘¯1˜⊂ ⨬(MonthDays|LeapMonthDays)
    LeapAndStart ← ≡˜⊂◿7 \+ ↘¯1⊂2⊸+ ˜↯ 365⊸⧻ =0 ◿4⇡₁₉₀₁2000
```

Putting those together, we feed the leap year and start days from `LeapAndStart`
into `F`. This gives us a list of years and how many premium Sundays they have.
We then take the sum of the results.

```uiua
    /+ ≡(F°⊟) LeapAndStart
171
```

#### How fast?

Fast enough.

```uiua
    ⊙◌⍜now(/+ ≡(F°⊟) LeapAndStart)
0.0002853870391845703
```

### With datetime

Thanks to Tyz for [this submission.](https://uiua.org/pad?src=0_19_0-dev_4__eJwz5HrUvvBRU6OhEdej3jm6YE6DgqGlgaGCkYGBAdejmWsfNTUpPOqa96hr_qOmZi6uQxtSEktSSzJzU7m4dBUQPAVDC0vLeEOjeGNDrsPbLcxMDAy4uPS1FWwNFB5N32_OBQB9tylM)

#### Problem with datetime

We can use Uiua's [datetime function](https://www.uiua.org/docs/datetime)
but we need to be clever since it behaves differently
going in vs coming out for dates from before the epoch (1970-1-1).

```uiua
    °datetime 1901_1_1
¯2177452800
    datetime ¯2177452800
[2039 1 1 0 0 0]
```

#### Quickstep by Quickstep

While raw `datetime` is problematic for this range,
`un datetime` is usable for our range of years and we can use that
exclusively for this problem. Let's start by creating a row of dates
that `un datetime` understands.
Make those dates be the first of each month.

```uiua
    1
    ⇡₁12
    ⍜-⇡₀ 1901 2000
    ♭₂ ⊞⊟₃
╭─
╷ 1901  1 1
  1901  2 1
  1901  3 1
  1901  4 1
  1901  5 1
... and so on
```

Convert them all to datetime representations:

```uiua
    °datetime
[¯2177452800 ¯2174774400 ¯2172355200 ¯2169676800 ... and so on
```

Normalize for Sundays by subtracting a specific Sunday from before the range,
for example, 31st of December 1899.

```uiua
    - °datetime 1899_12_31
[31622400 34300800 36720000 39398400 41990400 ... and so on
```

Every single day is some multiple of $24 \times 60 \times 60 = 86400\ seconds$
so dividing our range by that will give us the number of days since 1899-12-31.

```uiua
    ÷86400
[366 397 425 456 486 517 547 578 609 639 670 ... and so on
```

Since this represents *days elapsed since that certain Sunday*, other Sundays will
pop out as a $0$ once we `mod,7`. After that, we simply add the zeroes up.

> To run this program in the repl, you have to copy all of it and paste all of
> it at once.
> Otherwise the individual lines will validate with no context in between.

```uiua
    1
    ⇡₁12
    ⍜-⇡₀ 1901 2000
    ♭₂ ⊞⊟₃
    °datetime
    - °datetime 1899_12_31
    ÷86400
    /+ =0 ◿7
171
```

#### How fast is it?

It's pretty fast.
Both solutions are well within our $60$ second limit so
this is a success.

```uiua
    ⊙◌⍜now(
      1
      ⇡₁12
      ⍜-⇡₀ 1901 2000
      ♭₂ ⊞⊟₃
      °datetime
      - °datetime 1899_12_31
      ÷86400
      /+ =0 ◿7
    )
0.0009074211120605469
```
