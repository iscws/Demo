const KoaRouter = require("@koa/router");
const assetRouter = new KoaRouter({ prefix: "/cache" });

const { getResource, writeToFile, getResourceRead } = require("./util");
const { TXTFILENPATH } = require("./config");
// 查看图片
assetRouter.get("/", async (ctx) => {
  ctx.body = "cache page";
});

// 查看文本
assetRouter.get("/newtxt", async (ctx) => {
  const resource = await getResource(TXTFILENPATH);

  // 获取文件最后被修改的时间
  const lastModified = resource.mtime.toGMTString();
  ctx.set("Last-Modified", lastModified);

  // 检查请求头中是否包含if-modified-since字段
  if (ctx.headers["if-modified-since"] === lastModified) {
    // 如果修改时间匹配，则设置响应码为304 Not Modified
    return (ctx.status = 304);
  } else {
    // 如果修改时间不匹配，则设置响应主体为文件内容
    return (ctx.body = await getResourceRead(TXTFILENPATH));
  }
});

// 修改文本
assetRouter.post("/newchangetxt", async (ctx) => {
  // const ifModifiedSince = ctx.request.header["if-modified-since"];
  const body = ctx.request.body;

  await writeToFile(TXTFILENPATH, `\n${body.data}`);

  ctx.body = "写入成功";
});

// 查看照片
assetRouter.get("/img", async (ctx) => {
  // ctx.response.set("Cache-Control", "max-age=100"); //设置强缓存，过期时间为10秒
  ctx.response.set("Content-Type", "image/jpg");
  // ctx.response.set("Content-Type", "text/plain")
  ctx.body = await getResource();
});

assetRouter.get("/test", async (ctx) => {
  ctx.status = 304;
  ctx.body = "获取成功";
});

assetRouter.get("/");
module.exports = assetRouter;
