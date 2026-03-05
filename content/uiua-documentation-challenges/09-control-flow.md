+++
title = "Control Flow"
date = 2026-03-01
weight = 9

[extra]
doclink = "https://www.uiua.org/tutorial/Control Flow"
showtoc = true
+++

## Preamble

### Booleans

Booleans are quite simple in Uiua.
For example, in comparisons that return booleans, you will see
0 for false and 1 for true.

```uiua
# 12 is bigger than 5?
    >5 12
1

# 3 is bigger than 5?
    >5 3
0
```

## Challenge 1

**Write a program that pushes "small" if a number is less than 10, "medium"
if it is less than 100, and "large" otherwise.**

### C1 Solution

My solution

```uiua
⨬("large"|"medium"|"small")/+<[10 100]
```

given solution

```uiua
⨬("small"|"medium"|"large")/+≥[10 100]
```

**Why?**

*Note: The solutions just have a comparison flipped.
Same, but different. I think it is sufficient to only look at one of them.*

We're asked to consider less than 10 and less than 100.
Let's play around with the `less than` function and see if some pattern emerges.
Let's put 10 and 100 into an array and compare against inputs 0, 10 and 100.

```uiua
# The output is 1 where the comparison is true,
# 0 otherwise.
    < [10 100] 0
[1 1]

    < [10 100] 10
[0 1]

    < [10 100] 100
[0 0]
```

Can we use this to `switch` between three values?
We would need this to generate 0, 1 and 2 and then
put down our "small", "medium" and "large" values in
the right place.

Can't we just sum the comparison results?

```uiua
# Let's store the comparison in F
    F ← < [10 100]

# Shouldn't we just be able to `reduce add`
# to get the sum of the comparison results?
# Let's try for 1, 10 and 100
    [/+ F 1 /+ F 10 /+ F 100]
[2 1 0]
```

Looks promising. This can act as a selector for a
switch statement. Observe that:

* `[1 1]` sums to 2 for input less than 10
* `[0 1]` sums to 1 for input less than 100
* `[0 0]` sums to 0 for input 100 or more

So for selection 0, 1, 2 we have "large", "medium" and "small" respectively.
Let's experiment with `switch`

```uiua
# The switch statement, with some arguments;
# let's try inputs 0 and 2

    ⨬("large"|"medium"|"small") 0
"large"

    ⨬("large"|"medium"|"small") 2
"small"
```

Alright. Let's combine this switch statement with our comparison function, F,
from earlier. That should be our solution

```uiua
# Let's store our solution as G and test some cases
    G ← ⨬("large"|"medium"|"small")/+<[10 100]

    G 1
"small"

    G 10
"medium"

    G 9
"small"

    G 99
"medium"

    G 100
"large"
```

## Challenge 2

**Write a program that multiplies an array by its reverse until any element is
greater than 1000.**

### C2 Solution

My solution

```uiua
⍢(×⊸⇌|=0 /+ ≥1000)
```

and the intended solution

```uiua
⍢(×⊸⇌|≤1000/↥)
```

**Why? My solution**

I'll walk you through my thought process for my solution here.
Let's then compare it to the intended solution and learn something :)

We are being asked to *do something* until *something happens*.
Let's consider the `do` repeater. It will repeat a function while
a condition is true.

In broad strokes we want something on the form:

* -do(F|C)
* * F: multiply an array by its reverse
* * C: condition for an array that remains true until some element is 1000 or more

Let's try to experiment towards C

Let's store two test cases.
M for an array which the `do` should stop and N where `do` should continue.

```uiua
    M ← [9 142 1000 5]
    N ← [15 999 23]
```

Let's test them against `geq 1000`

```uiua
    ≥ 1000 M
[0 0 1 0]

    ≥1000 N
[0 0 0]
```

So, as in the first challenge, could we do some `sum reduce` trick?
Ah, shouldn't we then consider an array with more than one element greater than
or equal to 1000?

```uiua
# So what if all of them are greater or equal?
    ≥ 1000 [9000 1222 3000]
[1 1 1]

# Let's try reducing, what are the takeaways?
    /+ ≥ 1000 M
1
    /+ ≥ 1000 N
0
    /+ ≥ 1000 [9000 1222 3000]
3
```

We get back 1 and 3 in those cases where we want to stop.
In the other case, however, we get 0 in all places if none of the elements have
reached the threshold. This means that the continuation checker for `do` should
emit a 1 if all of the places are 0, that is, `reduce add`
of the comparison is 0.

We've identified the core components.
Let's consider them in the context of the checking function
and in the order they run.¹

```uiua
≥ 1000  # Identify all elements thousand or greater
/+      # Count them
=0      # Continue if the count is 0
```

Let's take it for a spin.

```uiua
# C asks the question, should we continue?
    C ← =0 /+ ≥ 1000

# Checking [15 999 23]
    C N
1

# Checking [9 142 1000 5]
    C M
0

# Multiple elements over the threshold?
    C [999 1000 1001 1002]
0

# One more test
    C[90 5 1]
1
```

Looks like we have the `C` part of our proposed `do(F|C)` method.

The `F` part is simpler. We've done [something similar](/uiua-documentation-challenges/03-arrays#challenge-1)
in the past. We want to multiply an array by its reverse.
We can do that with `mul by rev`.

```uiua
    × [1 2 3] [3 2 1]
[3 4 3]

    ×⊸⇌ [1 2 3]
[3 4 3]
```

Putting it together into `G = do(F|C)`

```uiua
    G ← ⍢(×⊸⇌|=0 /+ ≥1000)

# Ok, let's try something simple
    G [10 20 30]
[90000 160000 90000]

# Now let's do it by hand, does this seem to match?
    ×⊸⇌ [10 20 30]
[300 400 300]

# Then one more step, 
# and the output matches
    × ⊸⇌ [300 400 300]
[90000 160000 90000]
```

**Why? Intended solution**

For `G = do(F|C)` my solution differs in `C`.
So what's the difference? Did anything go wrong?

There's nothing very *wrong*, but we can simplify.

Let's focus on what we need.
Do we care if multiple numbers are over 1000? No, just any of them.
If one number is 1000 or over, then it is the highest number.
If multiple numbers are 1000 or over, then it doesn't matter which one of those
numbers we check for our question "is any element over 1000".

So, let's just check the highest number in the array at each step.
How do we get the biggest number from an array? With `reduce max`.

```uiua
# `reduce max` on a random array
    /↥ [1 5 1 10 2 14 0 ¯3]
14
```

We just have to continue if the highest number is `less than` 1000.
So what are we putting together?

```uiua
/↥    # Find the biggest number
<1000 # Continue if it is less than 1000
```

Our revised solution is therefore:

```uiua
    G ← ⍢(×⊸⇌|<1000/↥)

# Example
    G [10 20 30]
[90000 160000 90000]
```

**More solutions pls**.

Try this² C on for size then

```uiua
<1000   # Identify numbers smaller than 1000
/×      # Continue if all of them are smaller
```

And applying it

```uiua
    ⍢(× ⊸⇌|/× <1000) [1 2 1]
[1 65536 1]
    ⍢(× ⊸⇌|/× <1000) [0 5 0]
[0 390625 0]
```

\*¹\*²Thanks for the feedback Tyz.
