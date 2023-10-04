// 1. object.assign
const source = { way: "shallow", cout: 12 };
const target = { obj: { name: "iscws", height: 170 } };

const returnedObj = Object.assign(target, source);
console.log(target, source, returnedObj); //target与returnedObj 保持一致

returnedObj.obj.name = "leige";

console.log(target, returnedObj);

//直接拷贝source
const copy_source = Object.assign({}, source);
console.log(copy_source);

// 2. Array.prototype.concat()
let arr = [1, 3, { username: "kobe" }];
let arr2 = arr.concat();
arr2[2].username = "wade";
console.log(arr); //[ 1, 3, { username: 'wade' } ]

// 3. 展开运算符
let obj1 = { name: "Kobe", address: { x: 100, y: 100 } };
let obj2 = { ...obj1 };
obj1.address.x = 200;
obj1.name = "wade";
console.log("obj2", obj2); // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }

// 4.arr.slice()
let arr2 = [
  1,
  3,
  {
    username: " kobe",
  },
];
let arr3 = arr2.slice();
arr3[2].username = "wade";
console.log(arr2); // [ 1, 3, { username: 'wade' } ]
