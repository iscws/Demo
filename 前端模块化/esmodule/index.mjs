// index.mjs
import { count, add } from "./esmodule.mjs";

console.log("before add，count = ", count);
add();
console.log("after add，count = ", count);
