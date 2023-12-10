let str = "i love javascript very much";

function toUpper(str) {
  let tempStr = str.split(" ");
  for (let i = 0; i < tempStr.length; i++) {
    tempStr[i] = tempStr[i].charAt(0).toUpperCase() + tempStr[i].slice(1);
  }
  return tempStr.join(" ");
}

console.log(toUpper(str));
