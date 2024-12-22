const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class User {
  constructor(userName, email, id) {
    this.name = userName;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOps;
    if (this._id) {
      //update operation
      dbOps = db.collection('users').updateOne({ _id: this._id }, { $set: this });
    }
    else {
      dbOps = db.collection('users').insertOne(this)
    }
    return dbOps
      .then(result => { console.log(result) })
      .catch(err => { console.log(err) })
  }
  static findById(userId) {
    const db = getDb();
    return db.collection('users').find({ _id: new mongodb.ObjectId(userId) }).next()
      .then(user => {
        //console.log(user);
        return user;
      })
      .catch(err => { console.log(err) })
  }

}
module.exports = User;
