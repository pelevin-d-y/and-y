
function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //console.log('scrollTop', scrollTop, 'rect.top', rect.top)
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

var  baseOffset;

const addHandlersToItems = () => {
  const items = document.getElementsByClassName("lavel-item_circle");
  const activeOval = document.getElementsByClassName("club-oval")[0];
  Array.prototype.forEach.call(items,(function(elem) {
    let handler = function() {
      const targetOffset = offset(elem);
      activeOvalCoords.y = targetOffset.top - baseOffset.top;
      activeOval.style.transform=`translateY(${activeOvalCoords.y}px)`;
    }
    elem.parentElement.removeEventListener("mouseenter", handler,{passive: true});
    elem.parentElement.removeEventListener("touchstart", handler,{passive: true});
    elem.parentElement.addEventListener("mouseenter", handler,{passive: true});
    elem.parentElement.addEventListener("touchstart", handler,{passive: true});
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
