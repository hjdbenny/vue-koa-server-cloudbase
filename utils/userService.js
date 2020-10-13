const db = require("./db");
module.exports = {
    // getUser: async (id) => {
    //     return await User.findByPk(id);
    // },
    checkUser: async (name) => {
        return new Promise((resolve, reject) => {
            db.collection("users")
                .where({ name: name })
                .get()
                .then((res) => {
                    // res.data 包含该记录的数据
                    resolve(res.data.length ? res.data[0] : null);
                });
        });
    },
};
