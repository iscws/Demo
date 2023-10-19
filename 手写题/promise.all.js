function PromiseAll(arr) {
  let count = 0;
  let resArr = [];

  const processPromise = (data, index, handle) => {
    resArr[count] = data;
    count++;
    if (count + 1 === arr.length) {
      return handle(resArr);
    }
  };

  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] instanceof Promise) {
        arr[i].then(
          (res) => {
            processPromise(res, i, resolve);
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        processPromise(arr[i], i, resolve);
      }
    }
  });
}

const p1 = 1;
const p2 = new Promise((resolve, reject) => {
  resolve("2");
});

const p3 = new Promise((resolve, reject) => {
  resolve("3");
});

PromiseAll([p1, p2, p3])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
