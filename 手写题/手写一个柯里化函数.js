// 函数柯里化
function curry(fn) {
  const judge = (...args) => {
    if (fn.length === args.length) return fn(...args);
    return (...arg) => judge(...args, ...arg);
  };
  return judge;
}

const add = (a, b, c, d) => {
  return a + b + c + d;
};

const addCurry = curry(add);

console.log(addCurry(1, 2, 3)(4));
console.log(addCurry(1, 2, 3, 4));
