function shallowCopy(source) {
  var target = {};
  for (var i in source) {
    if (source.hasOwnProperty(i)) {
      target[i] = source[i];
    }
  }
  return target;
}

const obj = { a: { num: 1 }, b: 3 };
const copy_obj1 = obj;

const copy_shallowobj = shallowCopy(obj);

// 检查对象的地址是否相同
console.log(copy_shallowobj === obj, copy_obj1 === obj); //false true

// 浅拷贝对象：检查属性是否相同
copy_shallowobj.a.num = 4;
copy_shallowobj.b = 10;
console.log(copy_shallowobj.a, obj.a); //{ num: 4 } { num: 4 }
console.log(copy_shallowobj.b, obj.b); //10 3

// 赋值对象：检查属性是否相同
copy_obj1.b = 12;
console.log(obj); // { a: { num: 4 }, b: 12 }
