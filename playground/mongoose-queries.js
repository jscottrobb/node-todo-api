const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {ToDo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// var id = '59daf8cff555844c05584d9b11';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid');
// };

// ToDo.find({_id: id}).then((todos) => {
//   console.log('Todos: ',todos);
// });
//
// ToDo.findOne({_id: id}).then((todo) => {
//   console.log('Todo: ',todo);
// });

// ToDo.findById(id).then((todo) => {
//   console.log('Todo: ',todo);
// }).catch((err) => {
//   console.log(err);
// });

var id = new ObjectID().toHexString();

User.findById(id).then((user) => {
  if(!user) {
    return console.log('User was not found');
  }

  console.log('User by ID:', user);
}).catch((e) => {
  console.log('Error',e);
});
