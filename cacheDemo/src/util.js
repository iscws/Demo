const fs = require("fs");
function writeToFile(file, line) {
  return new Promise((resolve, reject) => {
    // 添加新的一行
    const newLine = "\n" + line;

    // 将修改后的文本写回到文件中
    fs.writeFile(file, newLine, { flag: "a" }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getResource(filePath) {
  return new Promise((res) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log(err);
      }
      res(stats);
    });
  });
}

function getResourceRead(filePath) {
  return new Promise((res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return;
      }
      res(data);
    });
  });
}

module.exports = {
  writeToFile,
  getResource,
  getResourceRead,
};
