const tcb = require('@cloudbase/node-sdk');
//云函数下指定环境为当前的执行环境
const app = tcb.init({
    env: 'cloudbase-koa-2gj0jhjr761e287a',
    secretId: 'AKIDVnnW3J19h14qKhjeCYgX7PedOt88qJTY',
    secretKey: 'zjCMIxLSSBfsnTtWrvjGZbuwf7JFuIOO',
});

const db = app.database();
module.exports = {
    db,
    app,
};
