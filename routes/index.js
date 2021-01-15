const { db, app } = require('../utils/db');
const dbCommon = require('../utils/dbCommon');
const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

router.get('/', async (ctx, next) => {
    await new Promise((resolve, reject) => {
        fs.readFile(
            path.resolve(__dirname, '../public/dist/index.html'),
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            }
        );
    }).then((data) => {
        ctx.body = data;
    });
});

module.exports = router;
