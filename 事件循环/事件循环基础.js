setTimeout(() => {
  console.log(0);
}, 0);
new Promise((resolve) => {
  console.log(1);
  resolve();
})
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  });
console.log(4);

//  宏任务
//[s0,]
//微任务
//[p2,p3]

//1
//4
//2
//3
//0
