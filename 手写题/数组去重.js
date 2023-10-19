// 借用set
const array = [1, 2, 2, 3, 3, 4];
const sortArray = [...new Set(array)];

console.log(sortArray);
