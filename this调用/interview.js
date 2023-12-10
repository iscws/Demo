// 面试题1
// var name = "window";
// var person = {
//   name: "person",
//   sayName: function () {
//     console.log(this.name);
//   },
// };
// function sayName() {
//   var sss = person.sayName;
//   sss();
//   person.sayName();
//   person.sayName();
//   (b = person.sayName)();
// }

// //window
// //person
// //person
// //window
// sayName();

// 面试题2
// var name = "window";

// var person1 = {
//   name: "person1",
//   foo1: function () {
//     console.log(this.name);
//   },
//   foo2: () => console.log(this.name),
//   foo3: function () {
//     return function () {
//       console.log(this.name);
//     };
//   },
//   foo4: function () {
//     return () => {
//       console.log(this.name);
//     };
//   },
// };

// var person2 = { name: "person2" };

// person1.foo1(); //person1
// person1.foo1.call(person2); //person2

// person1.foo2(); //window
// person1.foo2.call(person2); //window

// person1.foo3()(); //window
// person1.foo3.call(person2)(); //foo3显式绑定到person2上,但是调用位置还是在全局 window
// person1.foo3().call(person2); //person2

// person1.foo4()(); //foo4在person1上,由于箭头函数的this来源于所处作用域,所以这里foo4打印 person1
// person1.foo4.call(person2)(); //person2
// person1.foo4().call(person2); //person1

// 面试题3

var name = "window";
function Person(name) {
  this.name = name;

  (this.foo1 = function () {
    console.log(this.name);
  }),
    (this.foo2 = () => console.log(this.name)),
    (this.foo3 = function () {
      return function () {
        console.log(this.name);
      };
    }),
    (this.foo4 = function () {
      return () => {
        console.log(this.name);
      };
    });
}
var person1 = new Person("person1");
var person2 = new Person("person2");

person1.foo1(); //person1
person1.foo1.call(person2); //person1 答案:person2,因为显示绑定优先级大于隐式绑定

person1.foo2(); //window 答案: person1 会找上层this,上层this是person1
person1.foo2.call(person2); //window 答案: person1 箭头函数不受call影响

person1.foo3()(); //window
person1.foo3.call(person2)(); //window
person1.foo3().call(person2); //person2

person1.foo4()(); //person1 因为箭头函数会查找上一层的this,上一层的this指向的是person1
person1.foo4.call(person2)(); //person2
person1.foo4().call(person2); // window 答案:person1
