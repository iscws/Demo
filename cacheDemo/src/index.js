const Koa = require("koa");
const static = require("koa-static");
const path = require("path");
const publicPath = path.join(__dirname, "./../public");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const assetRouter = require(`./cache.route.js`);
const cors = require("@koa/cors");

app.use(cors());
app.use(bodyParser());
app.use(assetRouter.routes());
app.use(assetRouter.allowedMethods());

app.listen("9000", () => {
  console.log("服务器启动");
});
