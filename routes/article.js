const router = require('koa-router')();
const moment = require('moment');
const { db, app } = require('../utils/db');

router.prefix('/api/article');

// 获取文章列表
router.get('/getArticleList', async (ctx, next) => {
    let pageNumber = +ctx.query.pageNumber;
    let pageSize = +ctx.query.pageSize;
    let count = await db.collection('articles').count();
    let result;
    if (pageSize == 0) {
        result = await db
            .collection('articles')
            .orderBy('createTime', 'desc')
            .get();
    } else {
        result = await db
            .collection('articles')
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .orderBy('createTime', 'desc')
            .get();
    }
    for (let item of result.data) {
        item.id = item._id;
        if (item.imageFileIds && item.imageFileIds.length) {
            // 获取临时链接
            let tempFileUrl = await app.getTempFileURL({
                fileList: [item.imageFileIds[0]],
            });
            item.firstPic = tempFileUrl.fileList[0].tempFileURL;
        }
    }
    ctx.body = {
        code: 0,
        message: null,
        data: {
            datas: result.data,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalRecords: count.total,
        },
    };
});
// 根据id获取文章
router.get('/getArticle', async (ctx, next) => {
    let result = await db
        .collection('articles')
        .where({ _id: ctx.query.id })
        .get();
    result.data.forEach((item) => {
        item.id = item._id;
    });
    ctx.body = {
        code: 0,
        message: null,
        data: result.data[0],
    };
});
// 新增文章
router.post('/addArticle', async (ctx, next) => {
    let data = ctx.request.body;
    let result = await db.collection('articles').add({
        title: data.title,
        content: data.content,
        author: data.author,
        imageFileIds: data.imageFileIds,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    ctx.body = {
        code: 0,
        message: '新增成功',
        data: result.id,
    };
});
// 更新文章
router.post('/updateArticle', async (ctx, next) => {
    let data = ctx.request.body;
    let newData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (key != 'id') {
                newData[key] = data[key];
            }
        }
    }
    newData.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let result = await db
        .collection('articles')
        .where({ _id: data.id })
        .update(newData);
    ctx.body = {
        code: 0,
        message: '修改成功',
        data: null,
    };
});

// 根据id删除文章
router.delete('/deleteArticle', async (ctx, next) => {
    let data = ctx.request.body;
    let result = await db
        .collection('articles')
        .where({ _id: ctx.request.body.id })
        .remove();

    ctx.body = {
        code: 0,
        message: '删除成功',
        data: null,
    };
});

// 获取所有标签
router.get('/getAllTags', async (ctx, next) => {
    let result = await db.collection('articles').field({ tags: true }).get();
    let unique = result.data.map((item) => item.tags);
    ctx.body = {
        code: 0,
        message: null,
        data: Array.from(new Set(unique)),
    };
});

module.exports = router;
