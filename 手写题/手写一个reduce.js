Array.prototype.myReduce = function (cb, initValue) {
  if (!Array.isArray(this)) {
    throw new TypeError("not a array");
  }
  // 数组为空，并且有初始值，报错
  if (this.length === 0 && arguments.length < 2) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let arr = this;
  let res = null;

  if (arguments.length > 1) {
    res = initValue;
  } else {
    res = arr.splice(0, 1)[0];
  }

  for (let i = 0; i < arr.length; i++) {
    res = cb(res, arr[i], i, arr);
  }

  return res;
};

//   // 测试结果
let arr = [1, 2, 3, 4];
let result = arr.myReduce((res, cur) => {
  return res + cur;
});
console.log(result); // 10
