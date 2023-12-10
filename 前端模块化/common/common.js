var name = "name in common.js";
var count = 0;

function add() {
  count++;
  console.log("add call in common.js，count = ", count);
}
module.exports = {
  name,
  count,
  add,
};
console.log("module in common.js");
console.log(module);
