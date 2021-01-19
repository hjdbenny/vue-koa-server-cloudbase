const { db, app } = require('../utils/db');
const schedule = require('node-schedule');
const WebSocket = require('ws');
const moment = require('moment');

let scheduleInstance = {
    // 整点报时
    onTimeAlarm: () => {
        const wss = new WebSocket.Server({ port: 3001 });
        wss.on('connection', (ws) => {
            ws.on('message', (msg) => {
                console.log('server receive msg：', msg);
            });
            //每秒定时执行一次:
            schedule.scheduleJob('0-59 * * * * *', () => {
                if (moment().minute() === 0 && moment().second() === 0) {
                    ws.send(moment().format('YYYY-MM-DD HH:mm:ss'));
                }
            });
        });
    },
};

module.exports = scheduleInstance;
