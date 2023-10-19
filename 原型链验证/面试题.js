(function () {
  var A = function () {};
  A.prototype.n = 1;
  var b = new A();
  A.prototype = {
    n: 2,
    m: 3,
  };
  var c = new A();

  console.log(b.n); //b.__proto === A.prototype 1
  console.log(b.m); // undefined;

  console.log(c.n); //2
  console.log(c.m); //3
})()(function () {
  var foo = {},
    F = function () {};
  Object.prototype.a = "value a";
  Function.prototype.b = "value b";

  console.log(foo.a); // value a
  console.log(foo.b); // undefined

  console.log(F.a); //F.__proto__ === Function.prototype === Object.prototype value a
  console.log(F.b); // value b
})()(function () {
  function A() {}
  function B(a) {
    this.a = a;
  }
  function C(a) {
    if (a) {
      this.a = a;
    }
  }
  A.prototype.a = 1;
  B.prototype.a = 1;
  C.prototype.a = 1;

  console.log(new A().a); //1
  console.log(new B().a); //undefined
  console.log(new C(2).a); //2
})();
