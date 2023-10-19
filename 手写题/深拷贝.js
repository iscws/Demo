function deepClone(origin, map = new WeakMap()) {
  if (typeof origin !== "object") {
    return origin;
  }
  let target = Array.isArray(origin) ? [] : {};

  if (map.get(origin)) {
    // 缓存之前已经拷贝过的内容，防止循环引用
    return map.get(origin);
  }

  map.set(origin, target);

  //   进行深拷贝
  for (const key in origin) {
    // 判断该属性是不是属于原型上的,我们不复制原型
    if (origin.hasOwnProperty(key)) {
      target[key] = deepClone(origin[key], map);
    }
  }

  return target;
}

let obj = {
  a: 2,
  b: 3,
  c: {
    d: 4,
    e: 5,
  },
};

// 赋值只是建立关系,拷贝是一个一摸一样的值
let cloneObj = deepClone(obj);
obj.c.d = 12;
console.log(cloneObj.c);
