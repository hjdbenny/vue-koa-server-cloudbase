const utilsService = require("../utils/utilsService");

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        // ctx.status = e.statusCode || e.status || 200; //捕获异常并设置statusCode，默认500
        ctx.status = 200;
        let [code, msg] = e.message.split("::");
        ctx.body = utilsService.errMsg(Number(code), msg);
    }
};
