const chunk = (arr, size) => {
  if (size <= 0) return [];
  let res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }

  return res;
};

console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8], 2));
console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8], 3));
console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8], 4));
