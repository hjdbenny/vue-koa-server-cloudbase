const router = require("koa-router")();
const userService = require("../utils/userService");
const utilsService = require("../utils/utilsService");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

router.prefix("/api");

router.post("/auth", async (ctx, next) => {
    const auth = ctx.request.body;
    const user = await userService.checkUser(auth.name);
    if (!user) {
        ctx.throw("4010::用户名错误");
    } else {
        let curPassword = utilsService.md5Password(auth.password);
        if (user.password != curPassword) {
            ctx.throw("4011::密码错误");
        }
    }
    const token = {
        id: user._id,
        name: user.name,
        password: user.password,
    };
    // 签名token，返回
    ctx.body = {
        code: 0,
        message: null,
        data: {
            token: jwt.sign(token, config.SECRET, {
                expiresIn: config.EXP_TIME,
            }),
            userInfo: {
                id: user._id,
                name: user.name,
            },
        },
    };
});

module.exports = router;
