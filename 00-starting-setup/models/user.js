const mongoose = require('mongoose');
const { INTEGER } = require('sequelize');
const schema = mongoose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: { type: schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
    ]
  }
});
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newquantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newquantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newquantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newquantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart
  return this.save();
};
userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.addOrder = function () {
  const db = getDb();
  return this.getCart().then(products => {
    const order = {
      items: products,
      user: {
        _id: new mongodb.ObjectId(this._id),
        name: this.name
      }
    };
    return db.collection('orders')
      .insertOne(order)
  })
    .then(result => {
      this.cart = { items: [] };
      return db.collection('users')
        .updateOne({ _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
    });
};

module.exports = mongoose.model('User', userSchema);




/*
const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const { get } = require('../routes/admin');
class User {
constructor(userName, email, cart, id) {
  this.name = userName;
  this.email = email;
  this.cart = cart;
  this._id = id;
}

save() {
  const db = getDb();
  return db.collection('users').insertOne(this);
}

addToCart(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newquantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newquantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newquantity;
  }
  else {
    updatedCartItems.push({
      productId: new mongodb.ObjectId(product._id),
      quantity: newquantity
    })
  };
  const updatedCart = {
    items: updatedCartItems
  };
  const db = getDb();
  return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });

  /*
      const updatedCart = {
        items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }]
      };
      const db = getDb();
      return db.collection('users').updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      ); */
// }
/*
getCart() {
  const db = getDb();
  const productsIds = this.cart.items.map(i => {
    return i.productId;
  });
  return db
    .collection('products')
    .find({ _id: { $in: productsIds } })
    .toArray()
    .then(products => {
      return products.map(p => {
        return {
          ...p,
          quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        };
      });
    });
}

deleteItemFromCart(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  const db = getDb();
  return db.collection('users').updateOne(
    { _id: new mongodb.ObjectId(this._id) },
    { $set: { cart: { items: updatedCartItems } } }
  );
}

addOrder() {
  const db = getDb();
  return this.getCart().then(products => {
    const order = {
      items: products,
      user: {
        _id: new mongodb.ObjectId(this._id),
        name: this.name
      }
    };
    return db.collection('orders')
      .insertOne(order)
  })
    .then(result => {
      this.cart = { items: [] };
      return db.collection('users')
        .updateOne({ _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
    });
};


getOrders() {
  const db = getDb();
  return db.collection('orders')
    .find({ 'user._id': new mongodb.ObjectId(this._id) })
    .toArray();
}

  static findById(userId) {
  const db = getDb();
  return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => { console.log(err) })
}

}
module.exports = User;

*/