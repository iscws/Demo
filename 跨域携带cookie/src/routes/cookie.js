const KoaRouter = require("@koa/router");

const cookieRouter = new KoaRouter({ prefix: "/cookie" });

const cors = async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
  ctx.set("Access-Control-Allow-Headers", "content-type");
  ctx.set("Access-Control-Allow-Methods", "POST,GET,OPTIONS,HEAD,PUT,DELETE"); // 支持的方法
  ctx.set("Access-Control-Allow-Credentials", "true"); // 允许传入Cookie

  // 通过预检请求
  if (ctx.request.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }
  await next();
};

cookieRouter.post("/", cors, (ctx, next) => {
  ctx.cookies.set("name", "iscws", {
    maxAge: 1000 * 1000,
  });
  ctx.body = {
    code: 200,
    message: "响应成功",
  };
});

module.exports = cookieRouter;
