async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  return new Promise((resolve) => {
    console.log("async2");
    resolve();
  });
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");

// [setTimeout]
// [async1end, ]
// script start
// async1 start
// promise1
// async2
// promise2
// async1 end
// setTimeout
