const path = require('path');
const mongoConnect = require('./util/database').mongoConnect;
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
  User.findById('676c436ec10e8e0e287d615b')
    .then(use => {
      if (use) {
        req.user = new User(use.name, use.email, use.cart, use._id);
        console.log(req.user);
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

mongoConnect(() => {
  app.listen(3000);
});

