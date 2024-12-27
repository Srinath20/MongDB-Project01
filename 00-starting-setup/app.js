const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  User.findById('676e73c923792ebf5c4a6bd5')
    .then(user => {
      if (user) {
        req.user = user; // the returned user object is a full mongoose object, where we can call mongoose methods on it
      } else {
        console.log('User not found!');
      }
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://srinath:srinathg99@cluster1.euqij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
  .then(result => {
    User.findOne().then(use => {
      if (!use) {
        const user = new User({
          name: 'Srinath',
          email: 'srinath@gmail.com',
          cart: {
            items: []
          }
        });
        user.save()
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })

