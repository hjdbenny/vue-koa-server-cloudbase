const jwt = require("jsonwebtoken");
const config = require("../utils/config");
module.exports = async (ctx, next) => {
    let token;
    let authHeader = ctx.header.authorization;
    if (authHeader && ctx.url != "/api/auth") {
        let [authType, jwtToken] = authHeader.split(" ");
        if (authType.toLowerCase() === "bearer") {
            try {
                token = jwt.verify(jwtToken, config.SECRET);
                ctx.header.currentUser = token;
                let timeout = Date.now() - 1000 * token.exp;
                // 未过期，自动刷新token
                if (token && timeout >= 0) {
                    ctx.body = {
                        code: 4014,
                        message: "token 已过期，请重新登陆",
                    };
                } else {
                    let temp = {
                        id: token.id,
                        name: token.name,
                        password: token.password,
                        roles: token.roles,
                    };
                    let newToken = jwt.sign(temp, config.SECRET, {
                        expiresIn: config.EXP_TIME,
                    });
                    ctx.set({ "WWW-Authenticate": "Bearer " + newToken });
                    await next();
                }
            } catch (e) {
                if (e.name == "TokenExpiredError") {
                    ctx.body = {
                        code: 4014,
                        message: "token 已过期，请重新登陆",
                        data: null,
                    };
                } else {
                    ctx.body = {
                        code: -2,
                        message: e.message,
                        data: null,
                    };
                }
            }
        }
    } else {
        await next();
    }
};
