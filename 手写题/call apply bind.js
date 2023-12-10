// 手写call,基本思路
// 第一步 判断上下文类型 如果是undefined或者 null 指向window
//        否则使用 Object() 将上下文包装成对象 o
// 第二步 将调用的函数赋值给对象o的一个属性,如果调用这个属性,那this就指向了这个对象o
//        记得给这个属性添加一个独一无二的值,避免被覆盖

Function.prototype.customCall = function (thisArg, ...args) {
  const o = thisArg === undefined ? window : Object(thisArg);

  const key = Symbol();
  //   此处的this指向被调用的对象
  o[key] = this;
  const result = o[key](...args);
  delete o[key];

  return result;
};

Function.prototype.customApply = function (thisArg, args = []) {
  const o = thisArg === undefined ? window : Object(thisArg);

  const key = Symbol();
  //   此处的this指向被调用的对象
  o[key] = this;
  const result = o[key](...args);
  delete o[key];

  return result;
};

Function.prototype._bind = function (ctx, ...args) {
  // 下面的this就是调用_bind的函数,保存给_self
  const _self = this;
  // bind 要返回一个函数, 就不会立即执行了
  const newFn = function (...rest) {
    // 调用 call 修改 this 指向
    return _self.call(ctx, ...args, ...rest);
  };
  if (_self.prototype) {
    // 复制源函数的prototype给newFn 一些情况下函数没有prototype，比如箭头函数
    newFn.prototype = Object.create(_self.prototype);
  }
  return newFn;
};
