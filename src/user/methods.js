const { ObjectID } = require('mongodb');
const { getDatabase } = require('../database.js');
const { isUndefinedNullOrEmpty } = require('../utils/index.js')


const collectionName = 'customer';

async function getCustomer({ id }) {
    const database = await getDatabase();
    const array = await database.collection(collectionName).find({ id }).toArray();
    if (!isUndefinedNullOrEmpty(array) && array.length > 0) return array[0]
    else throw 'no data available'
}

async function _findCustomer({ id }) {
    const database = await getDatabase();
    return await database.collection(collectionName).find({ id }).toArray();
}

async function _isDuplicate({ id }, database) {
    let db = database;
    if (!db)
        db = await getDatabase();
    const result = await database.collection(collectionName).find({ id }).toArray();
    return !isUndefinedNullOrEmpty(result) && result.length > 0;
}

async function insertCustomer({ name,
    id,
    email,
    dialCode,
    countryCode,
    dob, international,
    significant }) {

    if (isUndefinedNullOrEmpty(id) || isUndefinedNullOrEmpty(email)) {
        throw `email ${email} or id ${id} is undefined`
    }
    try {
        const database = await getDatabase();
        const isDup = await _isDuplicate({ id }, database)
        if (isDup) throw 'Duplicate records';
        const { insertedId } = await database.collection(collectionName).insertOne({
            name,
            id,
            email,
            dialCode,
            countryCode,
            dob,
            international,
            significant
        });
        return insertedId;

    }
    catch (err) {
        throw err
    }


}

async function getCustomerList() {
    const database = await getDatabase();
    return await database.collection(collectionName).find({}).toArray();
}

async function deleteCustomer({ id }) {
    try {
        const records = await _findCustomer({ id })
        const database = await getDatabase();

        if (!isUndefinedNullOrEmpty(records)) {
            const { _id: dbId } = records[0]
            return await database.collection(collectionName).remove({
                _id: new ObjectID(dbId),
            });
        } else {
            throw `invalid action records : ${records} , dbId ${dbId} `
        }
    } catch (err) {
        throw err
    }


}

async function updateCustomer({ countryCode,
    dialCode,
    dob,
    email,
    prevId,
    id,
    name,
    international,
    significant }) {
    const records = await _findCustomer({ id: prevId })
    const database = await getDatabase();

    if (prevId !== id) {
        const isDup = await _isDuplicate({ id }, database)
        if (isDup) throw 'Duplicate records';
    }

    if (!isUndefinedNullOrEmpty(records)) {
        const { _id: dbId } = records[0]
        return await database.collection(collectionName).update(
            { _id: new ObjectID(dbId), },
            {
                $set: {
                    countryCode,
                    id,
                    dialCode,
                    dob,
                    email,
                    name,
                    international,
                    significant
                },
            },
        );
    } else throw 'no records found'

}

module.exports = {
    getCustomer,
    getCustomerList,
    insertCustomer,
    deleteCustomer,
    updateCustomer
};