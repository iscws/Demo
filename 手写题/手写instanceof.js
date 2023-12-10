// 我先想一想基本思路
// myInstanceof(a,b)
// 判断a是不是b的实例。
// 那就需要沿着a的proto向上查找,找到了就返回true,找不到就返回false

function myInstanceOf(obj, constructor) {
  if (typeof constructor !== "function") {
    throw new TypeError("Right-hand side of 'instanceof' is not an object");
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// console.log(myInstanceOf({}, Object));
