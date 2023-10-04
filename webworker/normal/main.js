const btn = document.getElementById("btn");
// console.log(window.Worker);
if (window.Worker) {
  const myWorker = new Worker("./worker.js");
  btn.addEventListener("click", () => {
    myWorker.postMessage("post");
    console.log("main: Message posted to worker");

    // 接收数据
    myWorker.onmessage = function (e) {
      console.log("main: main received data from work");
    };
  });
}
