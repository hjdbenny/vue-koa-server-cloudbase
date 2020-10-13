const crypto = require("crypto");

module.exports = {
    errMsg: (code, msg) => {
        return { code: code, message: msg };
    },
    md5Password: (password) => {
        return crypto.createHash("md5").update(password).digest("hex");
    },
    idExits: async (model, id) => {
        return (await model.findByPk(id)) ? true : false;
    },
    createId: () => {
        return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    },
};
