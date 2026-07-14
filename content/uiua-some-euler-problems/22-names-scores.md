+++
title = "22 - Names Scores"
date = 2026-07-13
weight = 22
[extra]
doclink = "https://projecteuler.net/problem=22"
pad = "https://uiua.org/pad?src=0_19_0-dev_4__eJxlkLFKA0EURfv5isusYJGYNGJhlUkksJBIWLRI-bI7MYvjzLIzY0ypRUICglXSWJjKXxDEyj-ZL5HdaGX1eDzOvffdCD1SqVfkpIVQxYwm0uUpKdyT8pL1EZYvaDdwgk6HsQixLrw7ZxEG0h1baOMgdWoyidMz3ObKTBaVVK7hZhLXyaDFIoyNR0oa1heFWtSXqVcKmu6kbbkHh6kpYY3yLjeaJTSvbWrvI_ChSMa8yUfiKol7seBNPogvL6rZFUlXJIJXyUZUWskOIFCz4XmJsHkN233YfIT1W6eJsP3C78LxZ1ThQ69cXqUrSd9IzHM3A_0rxLIIpLPqBY1SZj6VoCxj7Qa-dwirfXh6rPXfPxHW-7Bb9Q-VsR-AfoOw"
toc = true

[taxonomies]
categories = ["uiua-euler"]
tags = ["uiua", "euler"]
+++

## Problem

Using [names.txt](/other/0022_names.txt) (right click and
'Save Link/Target As...'), a 46K text file containing over five-thousand first
names, begin by sorting it into alphabetical order. Then working out the
alphabetical value for each name, multiply this value by its alphabetical
position in the list to obtain a name score.

For example, when the list is sorted into alphabetical order, COLIN, which is
worth $3 + 15 + 12 + 9 + 14 = 53$, is the $938$th name in the list. So,
COLIN would obtain a score of $938 \times 53 = 49714$.

What is the total of all the name scores in the file?

## Parsing

If you copy the contents of the file and prepend it with a `$`
it will be interpreted as a string looks something like this:

```uiua
$"MARY","PATRICIA","LINDA","BARBARA", ...
```

We are not going to be applying a score to the double quotes, so let's remove them.

```uiua
    $"MARY","PATRICIA","LINDA","BARBARA", ...
    ▽ ⊸≠@"

"MARY,PATRICIA,LINDA,BARBARA,..."
```

Then, let's split the string by comma, `@,` with the `pbbn` alias to
get an array of boxed names.

```uiua
    $"MARY","PATRICIA","LINDA","BARBARA", ...
    ▽⊸≠@"
    ⊜□⊸≠@,

["MARY"│"PATRICIA"│"LINDA"│"BARBARA"|...]
```

Let's sort and store the array in a variable `Input`.

```uiua
    Input ← ⍆ ⊜□⊸≠@, ▽ ⊸≠ @" $"MARY","PATRICIA",...
["AARON"│"ABBEY"│"ABBIE"│"ABBY"|...]
```

## Calculating a name

We can subtract a character from a string to get the
string's character differences to it. Since the characters are in sequence,
in the ASCII table, this is sufficient and no shuffling is needed.

We need a corrective character to subtract from a name, to get
their distances from it. `A` should be $1$ away, `B` should be $2$ and so on.

Let's find this character. We'll subtract $1$ from `A` in order to do so.

```uiua
    -1 @A
@@
```

OK, great. Then subtracting `@@` from a name should give us the alphabetical
value. For COLIN, as an example, we want $3 + 15 + 12 + 9 +14 = 53.$

```uiua
    - @@ "COLIN"
[3 15 12 9 14]
```

Then the alphabetical calculation is the summing up the character values.

```uiua
    /+ -@@ "COLIN"
53
```

Let's store this as function `F`.

```
    F ← /+ -@@
    F "BARBARA"
43
```

## Unboxing the contents

To apply `F` to each value in our array of boxes we must unbox its contents.
We can do the following.

```uiua
    ≡(F°□) Input
[49 35 19 30 ...]
```

We can also use the `content` modifier which unboxes arguments before they are
passed to a function.

```uiua
    ≡◇F Input
[49 35 19 30 ...]
```

## Solution

We need to apply increasing multipliers to the sorted alphabetical values.
Let's create a range, starting at $1$, as long as the list of values.

```uiua
    ⇡₁ ⊸⧻ ≡◇F Input
[49 35 19 30 40 ...]
[1  2  3  4  5  ...]
```

We multiply these arrays together and then reduce them for the final answer.

```uiua
    /+ × ⇡₁ ⊸⧻ ≡◇F Input
871198282
```
