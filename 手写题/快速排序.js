// 快速排序
function quickSort(arr) {
  let leftarr = [];
  let rightarr = [];

  let middleIndex = Math.floor(arr.length / 2); //取出中间值
  let pivot = arr.splice(middleIndex, 1)[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      leftarr.push(arr[i]);
    } else {
      rightarr.push(arr[i]);
    }
  }

  return quickSort(leftarr).concat([pivot], quickSort(rightarr));
}
