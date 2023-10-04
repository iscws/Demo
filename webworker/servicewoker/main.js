const btn = document.getElementById("btn");

if ("serviceWorker" in navigator) {
  btn.addEventListener("click", () => {
    navigator.serviceWorker.register("./worker.js").then(
      function (registration) {
        // 注册成功
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // 注册失败
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
