const KoaRouter = require("@koa/router");
const assetRouter = new KoaRouter({ prefix: "/cache" });
const fs = require("fs");
// 查看图片
assetRouter.get("/", async (ctx) => {
  ctx.body = "cache page";
});

// 查看文本
assetRouter.get("/txt", async (ctx) => {
  const getResource = () => {
    return new Promise((res) => {
      fs.readFile("./assets/testcache.txt", "utf8", (err, data) => {
        if (err) {
          return;
        }
        res(data);
      });
    });
  };
  ctx.response.set("Cache-Control", "public, max-age=10"); //设置强缓存，过期时间为10秒
  ctx.response.set("Content-Type", "text/plain");
  // ctx.response.set("Content-Type", "text/plain")
  ctx.body = await getResource();
});

// 查看文本
assetRouter.get("/img", async (ctx) => {
  ctx.response.set("Cache-Control", "max-age=100"); //设置强缓存，过期时间为10秒
  ctx.response.set("Content-Type", "image/jpg");
  // ctx.response.set("Content-Type", "text/plain")
  ctx.body = await getResource();
});

assetRouter.get("/");
module.exports = assetRouter;
