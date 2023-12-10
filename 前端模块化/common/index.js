// const obj = require("./common.js");
// console.log("module a in index.js", obj);

// console.log("---------------------------------------");
// console.log("测试commonJS 是否为静态");
// console.log("before add count", obj.count);
// obj.add();
// console.log("after add count", obj.count);

console.log("---------------------------------------");
const a = require("./common.js");
console.log("module a in index.js", a);

const b = require("./common.js");
console.log("a === b ?", a === b);
