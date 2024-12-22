const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://srinath:srinathg99@cluster1.euqij.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster1')
    .then(client => {
      console.log('Connected!');
      _db = client.db('test'); // to connect to the specified database
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
