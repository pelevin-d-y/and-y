// var jquery = require("jquery");
// window.$ = window.jQuery = jquery;
//
// $(document).ready(() => {
//   if ($('.club-wrapper').length) {
//     const activeOval = $('.club-oval')
//     const items = $('.lavel-item')
//
//     const itemHoverHandler = () => {
//       const windowWidth = $( window ).width()
//       const offset = windowWidth <= 1024 ? 36 : 26
//
//       items.each((index, el) => {
//         const topPosition = $(el).position().top + offset
//
//         $(el).mouseenter(() => {
//           activeOval.css('top', topPosition)
//         })
//       })
//       activeOval.css('top', $(items[0]).position().top + offset);
//     }
//     const itemHoverRemoveHandler = () => {
//       items.each((index, el) => {
//         $(el).unbind( "mouseenter" );
//       })
//     }
//
//     setTimeout(() => {
//       itemHoverHandler()
//     }, 200)
//
//     $(window).resize(() => {
//       itemHoverRemoveHandler()
//       itemHoverHandler()
//     })
//
//   }
// })

function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log('scrollTop', scrollTop, 'rect.top', rect.top)
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

var  baseOffset;

const addHandlersToItems = () => {
  const items = document.getElementsByClassName("lavel-item_circle");
  const activeOval = document.getElementsByClassName("club-oval")[0];
  Array.prototype.forEach.call(items,(function(elem) {
    let handler = function() {
      const targetOffset = offset(elem);
      console.log(targetOffset, baseOffset)
      activeOvalCoords.y = targetOffset.top - baseOffset.top;
      activeOval.style.transform=`translateY(${activeOvalCoords.y}px)`;
    }
    elem.parentElement.removeEventListener("mouseenter", handler);
    elem.parentElement.removeEventListener("touchstart", handler);
    elem.parentElement.addEventListener("mouseenter", handler);
    elem.parentElement.addEventListener("touchstart", handler);
  }))
}

function prepAnim() {
  const activeOval = document.getElementsByClassName("club-oval")[0];
  activeOvalCoords = {x:0, y:0}
  baseOffset = offset(activeOval);
  
  addHandlersToItems()
}
setTimeout(() => {
  prepAnim();  
}, 0)


// document.addEventListener('DOMContentLoaded', prepAnim);
window.addEventListener('resize', addHandlersToItems);
