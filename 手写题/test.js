// function myPromiseall(promiseArr) {
//   let resArr = [];
//   let count = 0;
//   return new Promise((resolve, reject) => {
//     const process = (index, value) => {
//       resArr[index] = value;
//       count++;

//       if (count === promiseArr.length) {
//         resolve(resArr);
//       }
//     };

//     for (let i = 0; i < promiseArr.length; i++) {
//       promiseArr[i].then(
//         (res) => {
//           process(i, res);
//         },
//         (err) => {
//           reject(err);
//         }
//       );
//     }
//   });
// }

// function myPromiseRace(promiseArr) {
//   let resArr = [];
//   return new Promise((resolve, reject) => {
//     for (let i = 0; i < promiseArr.length; i++) {
//       promiseArr[i].then(
//         (res) => {
//           process(i, res);
//         },
//         (err) => {
//           reject(err);
//         }
//       );
//     }
//   });
// }

// const p1 = new Promise((resolve, reject) => {
//   reject("1");
// });
// const p2 = new Promise((resolve, reject) => {
//   resolve("2");
// });

// const p3 = new Promise((resolve, reject) => {
//   resolve("3");
// });

// const resolved = Promise.resolve(42);
// const rejected = Promise.reject(-1);

// const allSettledPromise = Promise.allSettled([resolved, rejected]);

// allSettledPromise.then(function (results) {
//   console.log(results);
// });

// 防抖，每次只执行最后一次，用于搜索框
function debounce(fn, delay) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    });
  };
}
function throttle(fn, delay) {
  let previous = 0;
  return function () {
    let now = Date.now();
    if (now - previous > delay) {
      fn.apply(this, arguments);
    }
  };
}

// 深拷贝
function deep_clone(origin, map = new WeakMap()) {
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
    if (origin.hasOwnProperty(key)) {
      target[key] = deep_clone(origin[key], map);
    }
  }

  return target;
}

// 数组扁平化，通过递归的方式实现
function flat(arr, deep) {
  let res = [];

  (function innerFlat(innerArr, innerDeep) {
    for (let value of innerArr) {
      if (Array.isArray(value) && innerDeep > 0) {
        innerFlat(value, innerDeep - 1);
      } else {
        res.push(value);
      }
    }
  })(arr, deep);

  return res;
}

// console.log(flat([1, 2, 3, [4, 5, [6, 7]]], 2));
