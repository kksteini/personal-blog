hljs.registerLanguage('uiua', function () {
  return {
    case_insensitive: true,
    keywords: {
      // Adding to this as I use more symbols.
      // Remember to check: https://github.com/uiua-lang/uiua/blob/main/site/primitives.json
      $pattern: /[a-zA-Z]\w*|[^\s]/,
      arguments: ["∘", "◡", "∩"],
      'iterating-modifier': ["⍥"],
      'dyadic-pervasive': ["+"],
      'literal': ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    },
    contains: [
      {
        scope: 'string',
        begin: '"', end: '"'
      },
      hljs.COMMENT(
        '#', // begin
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

