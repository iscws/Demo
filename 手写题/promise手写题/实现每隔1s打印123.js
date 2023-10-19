// function promisePrint()
const arr = [1, 2, 3];
function print(value) {
  return new Promise((resovle, reject) => {
    setTimeout(() => {
      console.log(value);
      resovle(value);
    }, 1000);
  });
}

arr.reduce((prev, curr) => prev.then(() => print(curr)), Promise.resolve());
// 利用reduce实现了一个promise链。因为这道题要保证上一个promise解决后，下一个promise开始
// 这里reduce的第一个函数接收两个参数，一个是前一次处理数组的返回值，这里是promise（因为promise.then返回一个promise)，一个是当前数组的元素，每次执行时，它等待prev执行完毕之后，再执行print这个函数
