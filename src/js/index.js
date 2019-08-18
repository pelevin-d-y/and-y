var jquery = require("jquery");
window.$ = window.jQuery = jquery;

$(document).ready(() => {
  if ($('.club-wrapper').length) {
    const activeOval = $('.club-oval')
    const items = $('.lavel-item')
  
    const itemHoverHandler = () => {
      const windowWidth = $( window ).width()
      const offset = windowWidth <= 1024 ? 36 : 26
  
      items.each((index, el) => {
        const topPosition = $(el).position().top + offset
        
        $(el).mouseenter(() => {
          activeOval.css('top', topPosition)
        })
      })
    }
    console.log('aaaaaa')
    const itemHoverRemoveHandler = () => {
      items.each((index, el) => {
        $(el).unbind( "mouseenter" );
      })
    }
  
    setTimeout(() => {
      itemHoverHandler()
    }, 200)
  
    $(window).resize(() => {
      itemHoverRemoveHandler()
      itemHoverHandler()
    })

  }
})
