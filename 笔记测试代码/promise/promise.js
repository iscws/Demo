const promise = new Promise((resolve, reject) => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);
});

console.log(3);

Promise.resolve(() => {
  console.log(4);
});

const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error("fail")), 3000);
});
const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});

p2.then((result) => console.log(result)).catch((error) => console.log(error)); // Error: fail
