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

<<<<<<< Updated upstream
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
=======
function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

var  baseOffset;

function prepAnim(){
  const activeOval = document.getElementsByClassName("club-oval")[0];
  const items  = document.getElementsByClassName("lavel-item_circle");
  baseOffset = offset(activeOval);
  Array.prototype.forEach.call(items,(function(elem){
    let handler = function(){
      const targetOffset = offset(elem);
      console.log(targetOffset,baseOffset)
      const x = targetOffset.left - baseOffset.left;
      const y = targetOffset.top -  baseOffset.top;
      activeOval.style.transform=" translate("+x+"px,"+y+"px)";
    }
    elem.removeEventListener("mouseenter",handler);
    elem.addEventListener("mouseenter",handler);
  }))
}

prepAnim();
>>>>>>> Stashed changes

//document.addEventListener('DOMContentLoaded', prepAnim);
window.addEventListener('resize',prepAnim);
