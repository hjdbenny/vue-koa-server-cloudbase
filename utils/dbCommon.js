const { db, app } = require('./db');
let dbCommon = {
    getCollection: async (collectionName) => {
        let collectionNames = db.collection('collectionNames');

        let exist = await collectionNames
            .where({ collectionName: collectionName })
            .get();
        if (exist.data.length == 0) {
            await collectionNames.add({
                collectionName: collectionName,
            });
            await db.createCollection(collectionName);
        }
        return await db.collection(collectionName);
    },
};
module.exports = dbCommon;
