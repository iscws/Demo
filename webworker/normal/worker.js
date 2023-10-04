onmessage = function (e) {
  console.log("Worker: worker is sending message");

  postMessage("received");
};
