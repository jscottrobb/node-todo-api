require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
   var todo = new ToDo({
     text: req.body.text
   });

   todo.save().then((todo) => {
     res.send(todo);
   },
   (e) => {
     res.status(400).send(e);
   });
 });

 app.get('/todos', (req,res) => {
   ToDo.find().then((todos) => {
      res.send({todos});
    },
    (e) => {
      res.status(400).send(e);
    });
  });

  app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    ToDo.findById(id).then((todo) => {
       if (!todo) {
         return res.status(404).send();
       }
       res.send({todo});
     },
     (e) => {
       res.status(400).send(e);
     });
   });

   app.delete('/todos/:id', (req,res) => {
     var id = req.params.id;
     if (!ObjectID.isValid(id)) {
       return res.status(404).send();
     }

     ToDo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({todo});
      }).catch((e) => {
        res.status(400);
      });
    });

    app.patch('/todos/:id', (req,res) => {
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

      ToDo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo) => {
         if (!todo) {
           return res.status(404).send();
         }
         res.send({todo});
       }).catch((e) => {
         res.status(400);
       });
     });

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = {app};
