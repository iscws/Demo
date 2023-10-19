const origin_obj = {
  fn: function print() {
    console.log("hi");
  },
  innerObj: {
    a: 3,
    b: 4,
  },
  a: 12,
};

const { innerObj, fn } = origin_obj;
innerObj.a = 10;

console.log(origin_obj);
