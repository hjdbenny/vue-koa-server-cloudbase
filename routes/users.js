const router = require('koa-router')();
const db = require('../utils/db');

router.prefix('/api/user');

router.get('/getUserInfo', async (ctx, next) => {
    let user = await db.collection('users').where({ _id: ctx.query.id }).get();
    ctx.body = {
        code: 0,
        message: null,
        data: {
            id: user.data[0]._id,
            avatar: user.data[0].avatar,
            name: user.data[0].name,
            nickname: user.data[0].nickname,
            age: user.data[0].age,
        },
    };
});

router.post('/updateUserInfo', async (ctx, next) => {
    let data = ctx.request.body;
    let newData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (key != 'id') {
                newData[key] = data[key];
            }
        }
    }
    let user = await db
        .collection('users')
        .where({ _id: data.id })
        .update(newData);
    ctx.body = {
        code: 0,
        message: '修改成功',
        data: null,
    };
});

module.exports = router;
