const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {ToDo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// ToDo.remove({}).then((res) => {
//   return console.log(res);
// });

// ToDO.findOneAndRemove()
// ToDo.findByIdAndRemove();

// ToDo.findOneAndRemove({_id: '59dbccc29b5201104376594b'}).then((todo) => {
//   console.log(todo);
// });

ToDo.findByIdAndRemove('59dbccc29b5201104376594b').then((todo) => {
  console.log(todo);
});
