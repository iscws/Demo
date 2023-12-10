// esmodule.mjs
let count = 0;

let add = () => {
  count++;
  console.log("add call in esmodule.mjs，count = ", count);
};

export { count, add };
