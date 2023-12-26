"use strict";
function foo() {
  console.log(111);
  console.trace();
}

function bar() {
  console.trace();
  return foo();
}

// function baz() {
//   console.trace();
//   return bar();
// }

bar();
