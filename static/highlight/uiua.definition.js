hljs.registerLanguage('uiua', function () {
  return {
    case_insensitive: true,
    keywords: {
      // Adding to this as I use more symbols.
      // Remember to check: https://github.com/uiua-lang/uiua/blob/main/site/primitives.json
      $pattern: /[a-zA-Z]\w*|[^\s]/,
      arguments: ["∘", "◡", "∩"],
      'monadic-modifier': ["˜", "˙", "⊙"],
      'monadic-function': ["√"],
      'iterating-modifier': ["⍥"],
      'dyadic-pervasive': ["+"],
      'dyadic-function': ["÷", "ⁿ", "×", "-"],
      'dyadic-modifier': ["⍜"],
      'bound-function': ["F", "G"],
      'literal': ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    },
    contains: [
      {
        scope: 'string',
        begin: '"', end: '"'
      },
      hljs.COMMENT(
        '#', // begin
        '\n'
      )
    ]
  }
})


function waitForHighlightReady() {
  const highlightBlocks = document.querySelectorAll("pre.language-uiua")
  for (const block of highlightBlocks) {
    hljs.highlightElement(block)
  }
}

addEventListener("DOMContentLoaded", () => { waitForHighlightReady() })

