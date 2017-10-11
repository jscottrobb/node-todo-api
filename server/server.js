require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req,res) => {
   var todo = new ToDo({
     text: req.body.text,
     _creator: req.user._id
   });

   todo.save().then((todo) => {
     res.send(todo);
   },
   (e) => {
     res.status(400).send(e);
   });
 });

 app.get('/todos', authenticate, (req,res) => {
   ToDo.find({
     _creator: req.user._id
   }).then((todos) => {
      res.send({todos});
    },
    (e) => {
      res.status(400).send(e);
    });
  });

  app.get('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    var options = {
      _id: id,
      _creator: req.user._id.toHexString()
    };

    ToDo.findOne(options).then((todo) => {
       if (!todo) {
         return res.status(404).send();
       }
       res.send({todo});
     },
     (e) => {
       res.status(400).send(e);
     });
   });

   app.delete('/todos/:id', authenticate, (req,res) => {
     var id = req.params.id;
     if (!ObjectID.isValid(id)) {
       return res.status(404).send();
     }

     var options = {
       _id: id,
       _creator: req.user._id.toHexString()
     };

     ToDo.findOneAndRemove(options).then((todo) => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({todo});
      }).catch((e) => {
        res.status(400);
      });
    });

    app.patch('/todos/:id', authenticate, (req,res) => {
      var id = req.params.id;

      if (!ObjectID.isValid(id)) {
        return res.status(404).send();
      }

      var body = _.pick(req.body,['text','completed']);

      if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
      }
      else {
        body.completed = false;
        body.completedAt = null;
      }

      var options = {
        _id: id,
        _creator: req.user._id.toHexString()
      };

      ToDo.findOneAndUpdate(options, {$set: body},{new: true}).then((todo) => {
         if (!todo) {
           return res.status(404).send();
         }
         res.send({todo});
       }).catch((e) => {
         res.status(400);
       });
     });

     // POST user --- public signup route
     app.post('/users', (req,res) => {
        var body = _.pick(req.body,['email','password']);
        var user = new User(body);

        user.save().then((user) => {
            return user.genAuthToken();
          }).then((token) => {
            res.header('x-auth',token).send(user);
          })
          .catch((e) => {
             res.status(400).send(e);
          });
      });

     app.get('/users/me', authenticate, (req,res) => {
        res.send(req.user);
      });

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
     return user.genAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
     });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token',authenticate,(req, res) => {
   req.user.removeToken(req.token).then(() => {
     res.status(200).send();
   }, (err) => {
     res.status(400).send();
   });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = {app};
