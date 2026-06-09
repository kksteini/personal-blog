+++
title = "8 - Largest product in series"
date = 2026-06-09
weight = 8
[extra]
doclink = "https://projecteuler.net/problem=8"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

The four adjacent digits in the $1000$-digit number that have the greatest product are $9 \times 9 \times 8 \times 9 = 5832$.
731671765313306249192251196744265747423553491949349698352031277450632623957831801698480186947885184385861560789112949495459501737958331952853208805511125406987471585238630507156932909632952274430435576689664895044524452316173185640309871112172238311362229893423380308135336276614282806444486645238749303589072962904915604407723907138105158593079608667017242712188399879790879227492190169972088809377665727333001053367881220235421809751254540594752243525849077116705560136048395864467063244157221553975369781797784617406495514929086256932197846862248283972241375657056057490261407972968652414535100474821663704844031<b><span style="color:#ff2e88;">9989</span></b>000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450

Find the thirteen adjacent digits in the $1000$-digit number that have the
greatest product. What is the value of this product?

## Foundations

### Windows

In many programming languages, there is an operation that gives you an
enumerator over an array or a string. Look at the following examples and
see if you can spot how this is useful to this problem.

#### Ruby

```ruby
nums = "123456789"
enumerator = nums.chars.each_cons 2
enumerator.next
=> ["1", "2"]
enumerator.next
=> ["2", "3"]
enumerator.next
=> ["3", "4"]
```

#### Rust

```rust
fn main() {
    let nums = "123456789";
    let chars = nums.chars().collect::<Vec<char>>();
    for window in chars.windows(4) {
        println!("{:?}", window);
    }
}
```

```bash
❯ cargo run
['1', '2', '3', '4']
['2', '3', '4', '5']
['3', '4', '5', '6']
['4', '5', '6', '7']
['5', '6', '7', '8']
['6', '7', '8', '9']
```

## Uiua's Stencil

To get windows of an array in Uiua, use [stencil](https://www.uiua.org/docs/stencil).

Stencil is clever and can sometimes adjust the window size to the number
of arguments a function requires. For example, `add` needs
two arguments.

```uiua
    ⧈+ [0 1 2 1 6]
[1 3 3 7]
```

Otherwise, you can supply a function to `stencil` and
state the window size. *I like subscripts*.

```uiua
    st,13id"Shiver me timbers"
    ⧈₁₃∘"Shiver me timbers"
 ╭─                 
╷ "Shiver me tim"  
  "hiver me timb"  
  "iver me timbe"  
  "ver me timber"  
  "er me timbers"  
                  ╯ 
```

## Towards a solution

We know that we want to look at 13 digits at a time.
This should be possibly for us to do with windows, using `stencil`.
We just need to acquire a digit array.

### Digits from base 10

Let's imagine for a moment that we have to solve this for a 4-digit product
inside a 10 digit number. Maybe, $7281965729$ or something.

So, what we need is to change the number into an array of digits.

```uiua
    Wizardry 7281965729
[7 2 8 1 9 6 5 7 2 9]
```

One way we could do this is with `base,10`.
That will give us the number as an array, but in reverse.
Just to make reading easier, I'll apply `rev`.

```uiua
    rev base,10 
    ⇌ ⊥₁₀7281965729
[7 2 8 1 9 6 5 7 2 9]
```

Next we apply a `stencil` with a window size 4.
Let's supply the function `id` just to see what is happening.

```uiua
    ⧈₄∘ ⇌ ⊥₁₀ 7281965729
╭─
╷ 7 2 8 1
  2 8 1 9
  8 1 9 6
  1 9 6 5
  9 6 5 7
  6 5 7 2
  5 7 2 9
          ╯
```

Great. That looks correct.
Let's replace `id` with `reduce mul` to get the
digit products.

```uiua
    ⧈₄/× ⇌ ⊥₁₀ 7281965729
[112 144 432 270 1890 420 630]
```

Alright. $9 \times 6 \times 5 \times 7 = 1890$ is a clear winner.

Now we just have to acquire the maximum with `reduce max`

```uiua
    /↥ ⧈₄/× ⇌ ⊥₁₀ 7281965729
1890
```

Alright. Let's crunch the 1000 digit number.

```uiua
    /↥ ⧈₁₃/× ⇌ ⊥₁₀731..<truncated>..3450
    /↥ ⧈₁₃/× ⇌ ⊥₁₀inf
Error: Cannot take base of ∞
  at 1:12
```

Oh yeah. Our number is too big. It just gets changed into `inf`.
Uiua doesn't have BigInt.

### Digits from string

Let's then see what we can do with a string of digits instead.
Using the previous example number, how
do we acquire digits?

As before, we want something like this.

```uiua
    Wizardry "7281965729"
[7 2 8 1 9 6 5 7 2 9]
```

Well, think about a string. What is its shape?

```uiua
    △ "1234"
[4]
```

Isn't this the same shape as an array?

```uiua
    △ [1 2 3 4]
[4]
```

Usually, when we operate on a straightforward array in Uiua, we know to
use either a pervasive function or `rows` if we want something to apply
to each element.
Lets try `rows parse` on the string.

```uiua
    ≡⋕ "7281965729"
[7 2 8 1 9 6 5 7 2 9]
```

Nice. Now we can do the same thing as before.

```uiua
    /↥ ⧈₄/× ≡⋕ "7281965729"
1890
```

Excellent.
Now we can apply the same set of jargon to the 1000-digit number.

```uiua
    /↥ ⧈₁₃/× ≡⋕ "731..<truncated>..3450"
23514624000
```

### Extra credit - Getting digits pervasively

*Thanks to Tyz for the feedback.*.

Here it is again. Oh boy.

> If it's rows
>
> it is slows

If you are interested in speed, then we might want to consider a pervasive action
on the string instead.
In Uiua, when we subtract a character from a string, it results in
an array of differences. These differences are between the ordinal values
or the numerical representations of a character. For example.

```uiua
    -@A "ABCDEFG"
[0 1 2 3 4 5 6]
```

These distances climb as we go along in sequence.
Luckily, the characters for all digits, 0-9, are in sequence in the
ASCII table; from 48 to 57.

```uiua
    -@0 "0123456789"
[0 1 2 3 4 5 6 7 8 9]
```

Things inside the string don't have to be in sequence though.
We still obtain the distance of each character from the character '0',
namely the digit itself.

```uiua
    -@0 "812932842"
[8 1 2 9 3 2 8 4 2]
```

This gives us the corresponding digit array.

Let's apply this to the 1000 digit number.

```uiua
    /↥ ⧈₁₃/× -@0 "731..<truncated>..3450"
23514624000
```

#### How fast?

The pervasive solution runs very fast.

```uiua
    ⊙◌⍜now(/↥ ⧈₁₃/× -@0 "731..<truncated>..3450")
0.00003886222839355469
```

vs parse rows.

```uiua
    ⊙◌⍜now(/↥ ⧈₁₃/× ≡⋕ "731..<truncated>..3450")
0.00030612945556640625
```

So, if 3000 microseconds is not your jam and you really want 300 microseconds
instead, be pervasive.
