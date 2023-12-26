function addFive(a, total) {
  // "use strict";
  if (a < 1) return total;
  return addFive(a - 1, total + a);
}

addFive(100000, 0);
