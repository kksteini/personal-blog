# SimpleBigInt
┌─╴SBI
  FromString ← ≡⋕⇌
  ToString   ← /$"__"⇌
  AddNotFin  ← /↥ >9
  RemZer     ← ⨬(∘|↘¯1)=0⊸⊣
  Add        ← RemZer⍢(+ + ⊃(↻¯1|×¯10)⊸>9|AddNotFin) ⬚0 + ∩(˜⊂0)

  # Scale  : ARGUMENTS type:BigInt type:Number
  # Returns: BigInt multiplied/scaled by Number
  Scale ← /Add˜↯

  # Factorial: ARGUMENTS type:BigInt type:Number
  # Returns  : BigInt equal to Number * Number-1 * ... * 3 * 2 * 1.
  Factorial ← ⊙◌⍢(⊙-₁ ⊸Scale|> 1 ◌) [1]
└─╴
┌─╴test
  ˙⍤ ≍ [1 2 3] SBI~FromString "321"
  ˙⍤ ¬≍ [1 2 3] SBI~FromString "123"
  ˙⍤ ≍ "2" SBI~ToString SBI~Add SBI~FromString "1" SBI~FromString "1"
  ˙⍤ ≍ "81512091512039826153948215773282" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ¬ ≍ "81512091512039826153948215773281" SBI~ToString SBI~Add SBI~FromString "81512091512039815129823402934159" SBI~FromString "11024124812839123"
  ˙⍤ ≍ "100000000000000" SBI~ToString SBI~Add SBI~FromString "99999999999999" SBI~FromString "1"
  ˙⍤ ≍ "9999" SBI~ToString SBI~Scale SBI~FromString "1111" 9
  ˙⍤ ≍ "29668209657543473678132643" SBI~ToString SBI~Scale SBI~FromString "125182319230141239148239" 237
  ˙⍤ ≍ "265252859812191058636308480000000" SBI~ToString SBI~Factorial 30
└─╴

/+ SBI~Factorial 1000
