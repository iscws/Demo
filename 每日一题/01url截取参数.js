// Input: "https://jsrun.net/new?key1=value1&key2=value2";
// Output: {
// key1:"value1",
// key2:"value2"
// }

// Attention: The Input has all kinds of url, remember to consider all the conditions.

function getUrlParams(input) {
  // 第一步获取？后的字符
  const output = {};
  //   const str = input.slice()
  const index = input.indexOf("?");
  if (index < 0) return output;
  const str = input.slice(index + 1);
  if (str.length === 0) {
    return output;
  }

  //   让字符串根据&进行划分
  const strArr = str.split("&");
  strArr.forEach((item) => {
    const index = item.indexOf("=");
    output[item.slice(0, index)] = item.slice(index + 1);
  });
  return output;
}

console.log(getUrlParams("https://jsrun.net/new"));
