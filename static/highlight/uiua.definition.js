hljs.registerLanguage('uiua', function () {
  return {
    case_insensitive: true,
    keywords: {
      $pattern: /[a-zA-Z]\w*|[^\s]/,
      white: ["∘"],
      yellow: ["⍥"]
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

