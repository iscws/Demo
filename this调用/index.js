// function foo() {
//   console.log(this); // obj1对象
// }

// var obj1 = {
//   name: "obj1",
//   foo: foo,
// };

// var obj2 = {
//   name: "obj2",
//   obj1: obj1,
// };

// obj2.obj1.foo();

/**
 * 隐式丢失
 */

// function foo() {
//   console.log(this); //window
// }

// var obj1 = {
//   name: "obj1",
//   foo: foo,
// };

// // 讲obj1的foo赋值给bar
// var bar = obj1.foo;
// bar();

/**
 * 显示绑定
 */

// function foo() {
//   console.log(this);
// }

// foo.call(window); // window
// foo.call({ name: "why" }); // {name: "why"}
// foo.call(123); // Number对象,存放时123
