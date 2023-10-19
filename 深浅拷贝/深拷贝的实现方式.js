// 1. 使用JSON.parse的方式
// let arr = [
//   1,
//   3,
//   {
//     username: " kobe",
//   },
// ];
// let arr4 = JSON.parse(JSON.stringify(arr));

// let obj = {
//   a: "iscws",
//   fn: function (abc) {
//     return abc;
//   },
// };
// let copy_obj = JSON.parse(JSON.stringify(obj));

// console.log(arr4); //[ 1, 3, { username: ' kobe' } ]
// console.log(copy_obj); //{ a: 'iscws' }

// 2. 使用递归进行拷贝

function getType(target) {
  return Object.prototype.toString.call(target);
}

// 2.1 基础版:判断是否为对象,不是则直接返回
function deepClone_basic(target) {
  if (typeof target === "object") {
    let cloneTarget = {};
    for (const key in target) {
      cloneTarget[key] = deepClone_basic(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

// 2.2 判断数组
function deepClone_Array(target) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
      cloneTarget[key] = deepClone_Array(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

// 2.3 考虑循环引用
// 思路:额外开辟存储空间记录当前对象和拷贝对象的关系,有的话直接返回,没有的话继续拷贝
function deepClone_circulate(target, map = new Map()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone_circulate(target[key], map);
    }

    return cloneTarget;
  } else {
    return target;
  }
}

const obj = {
  a: 3,
  b: {
    c: 12,
  },
};

obj.b.target = obj;

const obj2 = deepClone_circulate(obj);
// 2.4 使用weakmap进行优化
// 思路：正常使用map的话，如果创建了一个obj对象，由于map的target对obj存在强引用关系，即使将obj设置为null，也无法让垃圾回收机制处理掉，内存无法被释放掉，而使用weakMap则可以帮我们释放掉。
function deepClone_circulate(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      console.log(map.get(target));
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone_circulate(target[key], map);
    }

    return cloneTarget;
  } else {
    return target;
  }
}

//2.5 深拷贝总结
// 1. 采用递归的方法
// 2. 使用 typeof 判断类型，确定是数组或是对象
// 3. * 使用weakmap进行优化，常规map，会存在键和值的强引用关系，即使对象设置为null也依然不会被垃圾回收掉，使用weakmap即可。
//  而且weakmap只接受对象和symbol为键,WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。

function deepClone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    const returnedTarget = Array.isArray(target) ? [] : {};
    // 把引用关系存储起来,用来处理循环引用的,否则会栈溢出
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, returnedTarget);

    for (const key in target) {
      returnedTarget[key] = deepClone(target[key], map);
    }
    return returnedTarget;
  } else {
    return target;
  }
}
// let foo = {
//   baz: function () {
//     console.log(this);
//   },
// };

// foo.baz();

// funtion throttle() {

// }
