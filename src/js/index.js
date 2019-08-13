var jquery = require("jquery");
window.$ = window.jQuery = jquery;

$(document).ready(() => {
  const activeOval = $('.club-oval')
  const items = $('.lavel-item')

  const positionActiveOval = activeOval.position()
  setTimeout(() => {
    items.each((index, el) => {
      const offset = 26
      const topPosition = $(el).position().top + offset

      $(el).hover(() => {
        activeOval.css('top', topPosition)
      })
    })
  }, 200)
})
