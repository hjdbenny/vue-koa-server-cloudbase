const router = require('koa-router')();
const moment = require('moment');
const { db, app } = require('../utils/db');
const fs = require('fs');

router.prefix('/api/common');

// 上传图片
router.post('/uploadImage', async (ctx, next) => {
    const file = ctx.request.files.file; // 获取上传文件
    let cloudPath = ctx.request.body.cloudPath
        ? ctx.request.body.cloudPath
        : null;
    let cloudFile = await app.uploadFile({
        cloudPath: cloudPath + file.name,
        fileContent: fs.createReadStream(file.path),
    });

    // 获取临时链接
    let tempFileUrl = await app.getTempFileURL({
        fileList: [cloudFile.fileID],
    });

    ctx.body = {
        code: 0,
        message: null,
        data: tempFileUrl.fileList[0],
    };
});

module.exports = router;
