const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOps;
    if (this._id) {
      //update operation
      dbOps = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    }
    else {
      dbOps = db.collection('products').insertOne(this);
    }
    return dbOps
      .then(result => {
        console.log(result);
        console.log(this);
      })
      .catch(err => { console.log(err) })
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray().
      then(products => {
        console.log(products)
        return products;
      })
      .catch(err => { console.log(err) })
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => { console.log(err) })
  }
  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(res => {
        console.log("deleted");
      })
      .catch(err => {
        console.log(err)
      })
  }
}
module.exports = Product;
