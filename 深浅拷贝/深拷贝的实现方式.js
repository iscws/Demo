// 1. 使用JSON.parse的方式
let arr = [
  1,
  3,
  {
    username: " kobe",
  },
];
let arr4 = JSON.parse(JSON.stringify(arr));

let obj = {
  a: "iscws",
  fn: function (abc) {
    return abc;
  },
};
let copy_obj = JSON.parse(JSON.stringify(obj));

console.log(arr4); //[ 1, 3, { username: ' kobe' } ]
console.log(copy_obj); //{ a: 'iscws' }
