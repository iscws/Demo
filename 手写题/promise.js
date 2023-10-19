class myPromise {
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();

    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 设置状态
    this.promiseStatus = "pending";
    // 设置基本值
    this.promiseResult = undefined;

    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    if (this.promiseStatus !== "pending") return;
    this.promiseStatus = "fullfilled";
    this.promiseResult = value;

    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      // 从数组中取出头部执行第一个
      this.onFulfilledCallbacks.shift()(this.promiseResult);
    }
  }

  reject(reason) {
    if (this.promiseStatus !== "pending") return;
    this.promiseStatus = "rejected";
    this.promiseResult = reason;

    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      // 从数组中取出头部执行第一个
      this.onRejectedCallbacks.shift()(this.promiseResult);
    }
  }

  then(onFullfilled, onRejected) {
    // 参数校验，确保传递函数进来
    onFullfilled =
      typeof onFullfilled === "function" ? onFullfilled : (val) => val;

    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const thenPromise = new myPromise((resolve, reject) => {
      const resolvePromise = (callback) => {
        setTimeout(() => {
          try {
            const x = callback(this.promiseResult);
            if (x === thenPromise) {
              throw new Error("不能返回自身");
            }

            if (x instanceof myPromise) {
              //  因为返回值是promise，不知道此时它是成功的还是失败的，所以需要用到一个then，让它去得知新promise的状态，从而才能顺利进行链式调用
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.promiseStatus === "fullfilled") {
        resolvePromise(onFullfilled);
      } else if (this.promiseStatus === "rejected") {
        resolvePromise(onRejected);
      } else if (this.promiseStatus === "pending") {
        // 发现还未转变状态，暂时把他们存起来
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFullfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    return thenPromise;
  }
}

const promise1 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve("成功");
  }, 1000);
})
  .then((res) => {
    console.log("第一个promise的then：", res);
    return new myPromise((resolve) => {
      resolve("第二个promise的then");
    });
  })
  .then((res) => {
    console.log(res);
  });

// const promise2 = new myPromise((resolve, reject) => {
//   reject("失败");
// });

// const promise3 = new myPromise((resolve, reject) => {
//   // reject("失败");
//   throw new Error("失败了");
// });

// console.log(promise2);
// console.log(promise3);

// 实现一个promise.all
function myPromiseAll(promises) {
  let promiseResults = [];
  let count = 0;
  return new myPromise((resolve, reject) => {
    const process = (value) => {
      promiseResults[count] = value;
      count++;

      if (count === promises.length) {
        resolve(promiseResults);
      }
    };

    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (res) => {
          process(res);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}

// 实现一个promise.race
function myPromiseRace(promises) {
  return new myPromise((resolve, reject) => {
    promises.forEach((value) => {
      value.then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
}

const p1 = new Promise((resolve, reject) => {
  resolve("1");
});

const p2 = new Promise((resolve, reject) => {
  resolve("2");
});

const p3 = new Promise((resolve, reject) => {
  resolve("3");
});

myPromiseAll([p1, p2, p3]).then((res) => {
  console.log(res);
});
