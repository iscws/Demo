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
      fs.readFile("./public/testcache.txt", "utf8", (err, data) => {
        if (err) {
          return;
        }
        res(data);
      });
    });
  };

  ctx.response.set("Cache-Control", "public, max-age=3000"); //设置强缓存，过期时间为10秒
  ctx.response.set("Content-Type", "text/plain");
  // ctx.response.set("Content-Type", "text/plain")
  ctx.body = await getResource();
});

// 修改文本
assetRouter.post("/txt", async (ctx) => {
  const body = ctx.request.body;
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
  await writeToFile("./public/testcache.txt", `\n${body.data}`);
  ctx.body = "写入成功";
});

// 查看照片
assetRouter.get("/img", async (ctx) => {
  // ctx.response.set("Cache-Control", "max-age=100"); //设置强缓存，过期时间为10秒
  ctx.response.set("Content-Type", "image/jpg");
  // ctx.response.set("Content-Type", "text/plain")
  ctx.body = await getResource();
});

assetRouter.get("/");
module.exports = assetRouter;
