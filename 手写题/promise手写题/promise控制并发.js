// 分块
function chunks(arr, chunk) {
  let res = [];
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    res.push(arr.slice(i, i + chunk));
  }

  return res;
}
