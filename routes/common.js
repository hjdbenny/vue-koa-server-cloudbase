const router = require('koa-router')();
const moment = require('moment');
const { db, app } = require('../utils/db');
const fs = require('fs');
const nodemailer = require('nodemailer');

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

// 发送邮件
router.post('/sendMail', async (ctx, next) => {
    let transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: ctx.request.body.sender,
            pass: 'qmjdzmhnuszgbjba', //授权码,通过QQ获取
        },
    });

    var mailOptions = {
        from: ctx.request.body.sender, // 发送者
        to: ctx.request.body.receiver, // 接受者,可以同时发送多个,以逗号隔开
        subject: ctx.request.body.title, // 标题
        html: ctx.request.body.html,
    };
    let mailPromise = () => {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                    res.send('发送成功'); //res.send()后面的语句不会执行，若想要执行语句，放在res.send()语句前面；
                }
            });
        });
    };
    await mailPromise();
    ctx.body = {
        code: 0,
        message: null,
        data: '发送成功',
    };
});

module.exports = router;
