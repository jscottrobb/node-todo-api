var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
   var todo = new ToDo({
     text: req.body.text
   });

   todo.save().then((doc) => {
     res.send(doc);
   },
   (e) => {
     res.status(400).send(e);
   });
 });

 app.get('/todos', (req,res) => {
   ToDo.find().then((docs) => {
      res.send({docs});
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

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = {app};
