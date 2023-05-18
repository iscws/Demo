const Koa = require("koa");
const cookieRouter = require("./routes/cookie");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
app.use(bodyParser());

app.use(cookieRouter.routes());
// 注册中间件
app.use((ctx, next) => {
  ctx.response.body = "hello world";
});

app.listen("9000", () => {
  console.log("服务器启动");
});
