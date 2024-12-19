const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://srinath:srinathg99@cluster01.euqij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01')
        .then(client => {
            console.log('Connected!');
            _db = client.db('test');
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
