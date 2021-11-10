const { MongoClient } = require('mongodb');

let database = null;
let password = 'loremipsum123'

async function startDatabase() {
    const mongoDBURL = `mongodb+srv://max:${password}@customercluster.rezau.mongodb.net/test`
    const connection = await MongoClient.connect(mongoDBURL, { useNewUrlParser: true });
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

module.exports = {
    getDatabase,
    startDatabase,
};