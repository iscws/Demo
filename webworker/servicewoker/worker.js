// 监听 install 事件，缓存资源
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache-name").then(function (cache) {
      return cache.addAll(["./index.html", "./main.js"]);
    })
  );
});

// 监听 fetch 事件，拦截网络请求并返回缓存的资源
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }

      // 如果没有缓存，即时发起网络请求
      return fetch(event.request);
    })
  );
});
