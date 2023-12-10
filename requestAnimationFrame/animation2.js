// 简单动画函数封装
function animate(obj, rug) {
  var timer = setInterval(function () {
    if (obj.offsetLeft >= rug) {
      clearInterval(timer);
    }
    obj.style.left = obj.offsetLeft + 2 + "px";
  }, 30);
}
var div = document.querySelector("#stBox");
animate(div, 300);
