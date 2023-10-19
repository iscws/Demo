// reduce实现求和
// reduce支持传递两个参数，第一个参数为函数，四个参数：上一个值，当前值，当前索引，上一个索引.
// 第二个参数为初始值
const arr = [1, 2, 3, 4];
const sum = arr.reduce((pre, cur) => pre + cur, 10);
console.log(sum);
