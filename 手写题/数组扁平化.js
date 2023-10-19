// const arr = [1, 2, [3, [4, 5]]];

// // 方法一：使用es6的flat方法，可以传递拍扁层级
// // console.log(arr.flat(Infinity));

// // 方法二：递归拍扁:使用isArray + 递归 + concat的方法
// // 基本思路：通过循环的方式，依次遍历数组元素。如果遇到数组，就进行递归，利用array.concat的方式将当前层级的数组和上一层数组合并起来。然后最后返回回去给上一层，然后一层一层进行返回。最终得到结果
// // 缺点：无法控制嵌套层级
// function recursionFlat(arr) {
//   // 创建一个空数组进行承接
//   let res = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) {
//       let middle = recursionFlat(arr[i]);
//       res = res.concat(middle);
//     } else {
//       res.push(arr[i]);
//     }
//   }
//   return res;
// }

// // 方法三：控制层级，利用自执行函数控制层级
// function flatern(arr, depth = 1) {
//   let res = [];

//   (function flat(innerArr, innerdepth) {
//     innerArr.forEach((value) => {
//       if (Array.isArray(value) && innerdepth > 0) {
//         flat(value, innerdepth - 1);
//       } else {
//         res.push(value);
//       }
//     });
//   })(arr, depth);

//   return res;
// }

// console.log(flatern(arr, 2));

function flatern(arr, depth = 1) {
  let res = [];

  (function flat(innerArr, innerDepth) {
    innerArr.forEach((item) => {
      //   判断是否为数组而且当前层级还没到0
      if (Array.isArray(item) && innerDepth > 0) {
        flat(item, innerDepth - 1);
      } else {
        res.push(item);
      }
    });
  })(arr, depth);

  return res;
}

let arr = [1, 2, [3, [4, 5, [6, 7]]]];
console.log(flatern(arr, 2));
