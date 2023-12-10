const element = document.getElementById("raBox");
// requestAnimationFrame请求动画帧方式

// 每一帧向前1px
function requestAnimationFrameFn() {
  element.style.left = "0px";
  function callbackFn() {
    // console.log(111);
    let leftVal = parseInt(element.style.left);
    if (leftVal >= 300) {
      // 不再继续递归调用即可，就不会继续执行了，下面这个加不加都无所谓，因为影响不到
      // cancelAnimationFrame取消请求动画帧，用的极少，看下，下文中的回到顶部组件
      // 大家会发现并没有使用到这个api（这样写只是和clearInterval做一个对比）
      // 毕竟，正常情况下，requestAnimationFrame会自动停下来
      //   cancelAnimationFrame(timer); // 可注掉（很少用到）
      //   return;
    } else {
      element.style.left = leftVal + 1 + "px";
      window.requestAnimationFrame(callbackFn);
    }
  }
  window.requestAnimationFrame(callbackFn);
}

requestAnimationFrameFn();
