function heapSort(arr) {
  const length = arr.length;
  //   建堆
  // 建堆
  for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
    heaplify(arr, i, length);
  }

  // 对堆进行排序
  // 每次把堆顶的数与最后一个数交换，并重新调整堆
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i);
    heaplify(arr, 0, i);
  }
  return arr;
}

function heaplify(arr, i, length) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < length && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < length && arr[right] > arr[largest]) {
    largest = right;
  }

  if (i !== largest) {
    // 交换节点
    swap(arr, i, largest);
    heaplify(arr, largest, length);
  }
}

function swap(arr, a, b) {
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

console.log(heapSort([3, 2, 3, 1, 2, 4, 5, 5, 6]));
