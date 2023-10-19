const abc = new Object({
  a: 12,
});

// function damn() {
//   console.log("damn func");
// }

// console.log(abc.prototype);

function add(a, b) {
  return a + b;
}
var add = function (a, b) {
  return a + b;
};

// 在谷歌浏览器控制台中运行会报错因为谷歌浏览器的策略导致，但对于JavaScript而言是合法的语法
// add = new Function('a', 'b', 'return a + b;' );
// console.log(add.prototype);

// Object === function Object``
// Function === function Function

Object.prototype.__proto__; //null
Function.prototype.__proto__;
Object.__proto__;

// console.log(Object.__proto__ === Function.prototype);
// console.log(Function.prototype.__proto__ === Object.prototype);

// 2. 尝试写出它的原生写法
class Person {
  constructor(name) {
    this.name = name;
  }
  printName() {
    console.log("This is printName");
  }
  commonMethods() {
    console.log("我是共享方法");
  }
}

class Student extends Person {
  constructor(name, score) {
    super(name);
    this.score = score;
  }
  printScore() {
    console.log("This is printScore");
  }
}

// console.log(Student.constructor);

let stu = new Student("小红");
let person = new Person("小紫");
console.log(stu.commonMethods === person.commonMethods);

// function Person(name) {
//   this.name = name;
//   this.printName = function () {
//     console.log("This is printName");
//   };
// }
// Person.prototype.commonMethods = function () {
//   console.log("我是共享方法");
// };

// function Student(name, score) {
//   Person.call(this, name);
//   this.score = score;
//   this.printScore = function () {
//     console.log("This is printScore");
//   };
// }

// Student.prototype = new Person();
// let person = new Person("小紫", 80);
// let stu = new Student("小红", 100);
// console.log(stu.printName === person.printName); //false
// console.log(stu.commonMethods === person.commonMethods); //true

var F = function () {};
// F.__proto__ === Function.prototype.__proto__ === Object.prototype

Object.prototype.a = function () {
  console.log("a");
};
Object.prototype.b = function () {
  console.log("undefined");
};

Function.prototype.b = function () {
  console.log("b");
};

var f = new F();

f.a(); //a
f.b(); //undefined

F.a(); //a
F.b(); //b

// function xxx() (这个实际上是 function Function 的实例函数)
// 构造函数既有proto也有prototype
//f.proto => F.prototype.proto => Object.prototype
// F.proto => Function.prototype
