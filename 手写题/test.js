// 手写一个深拷贝
function deepClone(origin, map = new WeakMap()) {
  if (typeof origin !== "object") {
    return origin;
  }

  let target = Array.isArray(origin) ? [] : {};

  // 解决循环引用问题
  if (map.get(origin)) {
    return map.get(origin);
  }

  map.set(origin, target);

  for (let key in origin) {
    // 用来防止遍历到原型上的属性
    if (Object.hasOwnProperty(key)) {
      target[key] = deepClone(origin[key], map);
    }
  }

  return target;
}

// 手写一个call和apply
Function.prototype.myCall = (thisArg, ...args) => {
  // const obj = thisArg === undefined ? window : Object.create(thisArg);
  const o = thisArg === undefined ? window : Object(thisArg);

  const key = Symbol();

  o[key] = this;
  // call
  const returnVal = o[key](...args);
  //如果是apply 上面就不是 ...args 而是 arg
  delete o[key];
  return returnVal;
};

// call的作用：拿到别人的this,并执行自己的函数，this指向的是thisArg
// 手写一个new
function myNew(origin, ...args) {
  let target = Object.create(origin.prototype);
  let returnValue = origin.apply(this, args);

  return returnValue instanceof Object ? returnValue : target;
}

//手写promise.all
function myPromiseAll(array) {
  let res = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    const processData = (item, index) => {
      res[index] = item;
      count++;
      if (count === array.length - 1) {
        resolve(res);
      }
    };

    for (let i = 0; i < array.length; i++) {
      array[i]().then(
        ((res) => {
          processData(res, i);
        },
        (err) => {
          reject(err);
        })
      );
    }
  });
}
