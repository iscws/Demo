"use strict";

function add1toN(n) {
  if (n === 0) return 0;

  console.trace();
  return add1toN(n - 1) + n;
}

add1toN(5);
