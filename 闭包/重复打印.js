// 每3s alert一次hello，连续四次

function fn(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("hello");
      resolve();
    }, time);
  });
}

// 用递归的方式
function repeat(fn, times, wait) {
  if (times === 0) return;
  fn(wait).then(() => {
    repeat(fn, times - 1, wait);
  });
}

repeat(fn, 4, 1000);
// repeat(fn, times, wait);
