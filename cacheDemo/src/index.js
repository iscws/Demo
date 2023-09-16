const Koa = require("koa");
const static = require("koa-static");
const path = require("path");
const publicPath = path.join(__dirname, "./../public");
console.log(static(publicPath));
const app = new Koa();
const assetRouter = require(`./cache.route.js`);

app.use(assetRouter.routes());
app.use(assetRouter.allowedMethods());

app.use(async (ctx, next) => {
  // 静态资源的 URL 以 /img 开头
  if (ctx.url.startsWith("/img")) {
    ctx.set("Cache-Control", "only-if-chached");
  }
  await next();
});
// // 注册中间件
// app.use((ctx, next) => {
//   //   console.log("middleware");
//   ctx.response.body = "hello world";
// });
app.use(static(publicPath));

app.listen("9000", () => {
  console.log("服务器启动");
});
