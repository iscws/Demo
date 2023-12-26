function headSort(arr) {
  //   const sortArr = new Array(arr.length);
  // 建堆
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heaplify(arr, i, arr.length);
  }

  //   // 每次把堆顶的数与最后一个数交换，并重新调整堆
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i);
    heaplify(arr, 0, i);
  }

  return arr;
}

// 堆调整
function heaplify(arr, i, len) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < len && arr[left] < arr[largest]) {
    largest = left;
  }

  if (right < len && arr[right] < arr[largest]) {
    largest = right;
  }
  //   进行交换
  if (largest !== i) {
    swap(arr, i, largest);

    // 重新对根节点进行堆调整
    heaplify(arr, largest, len);
  }
}

function swap(arr, a, b) {
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

console.log(headSort([3, 2, 3, 1, 2, 4, 5, 5, 6]));
