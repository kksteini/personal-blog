// Wowee what a hecking dumb thing to do
// I am using the inline styles of Giallo.
// I need to reconfigure this thing to not break
// so that no javascript is needed.

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("span").forEach(el => {
    if (el.textContent.startsWith("#")) {
      el.classList.add("is-comment")
    }
  })
})
