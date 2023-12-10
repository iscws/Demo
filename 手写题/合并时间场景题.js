// 实现一个函数，判断一组数字是否连续。当出现连续数字的时候以‘-’输出
// const arr = [2, 3, 4, 7, 8, 9, 10, 13, 15]
// 期望结果：["2-4", "7-10", 13, 15]

// 思路：这道题用两个指针吧，一个指针cur指向需要处理的数值，一个指针next指向下一个数字，
// 如果是连续的，那么2指针会继续到下一个。他们之间的差值为next的索引-cur的索引。

const merge = (arr) => {
  if (arr.length == 1) return [arr[0]];
  let cur = 0;
  let next = 1;

  let res = [];

  while (cur !== arr.length) {
    let diffIndex = next - cur;
    // 这个代表当前next指针指向哪了。
    if (diffIndex + arr[cur] === arr[next]) {
      next++;
      //   cache =
    } else {
      if (diffIndex === 1) {
        res.push(arr[cur]);
      } else {
        res.push(`${arr[cur]}-${arr[next - 1]}`);
      }
      cur = next;
      next++;
    }
  }

  return res;
};

const arr = [2, 3, 4, 7, 8, 9, 10, 13, 15];
console.log(merge(arr));

const arr3 = [];
console.log(arr3.shift());

let str = "1->2->3->4->";
console.log(str.slice(0, str.length - 3));
