const Koa = require("koa");
const app = new Koa();
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const helmet = require("koa-helmet");
const koaStatic = require("koa-static");
const koaBody = require("koa-body");
const json = require("koa-json");
const router = require("./routes/index");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const articleRouter = require("./routes/article");
const errorHandler = require("./middlewares/errorHandler");
const jwtResolver = require("./middlewares/jwtResolver");

// error handler
onerror(app);

// middlewares
app.use(
    cors({
        exposeHeaders: [
            "WWW-Authenticate",
            "Server-Authorization",
            "x-show-msg",
        ],
    })
);
app.use(helmet());
app.use(logger());
app.use(koaStatic(__dirname + "/public"));
app.use(errorHandler);
app.use(
    koaBody({
        multipart: true,
        parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
        formidable: {
            maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
        },
    })
);
app.use(json());
app.use(jwtResolver);

// logger
app.use(async (ctx, next) => {
    await next();
});

// router
app.use(router.routes());
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(articleRouter.routes());

module.exports = app;
