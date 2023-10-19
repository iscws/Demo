Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });

//   [rt0,rt1]
// 0
// [rt1,dealr]
// 1
// [dearlr,rt2]
// 解析reteuurn promise.resolve
// [rt2,pr4]
// 2
// [pr4,rt3]
// 解析resolve4，并把then函数推入栈
// [rt3,tres]
// 3
// [tres,rt5]
// 4
// [rt5,rt6,rt7]
// 5,6,

//   最关键的是第二步，按照正常理解就是会想成遇到promise.resolve就把他送入微任务队列，等他执行完了就去执行then函数，共2次添加进微任务队列
// 实际上原生是这么做的： return Promise.resolve(4); 把解析这段放入微任务队列，把处理这段放入微任务队列。等他执行完了再把then函数放入微任务队列，共3次添加进微任务队列
