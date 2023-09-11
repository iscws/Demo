const Koa = require("koa");

const app = new Koa();

// 注册中间件
app.use((ctx, next) => {
  console.log("middleware");
  ctx.response.body = "hello world";
});

app.listen("9000", () => {
  console.log("服务器启动");
});
