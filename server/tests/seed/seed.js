const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var userId1 = new ObjectID();
var userId2 = new ObjectID();
const userData = [{
  _id: userId1,
  email: 'jrobb1111@gmail.com',
  password: 'sunny111',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userId1.toHexString(), access: 'auth'}, 'secret').toString()
  }]
},
{
  _id: userId2,
  email: 'jrobb2222@gmail.com',
  password: 'sunny222'
}];

const todoData = [{
  text: 'First todo',
  _id: new ObjectID(),
  completedat: 123
},{
  text: 'Second todo',
  _id: new ObjectID()
},{
  text: 'Third todo',
  _id: new ObjectID(),
  completed: true
}];

var populateTodos = (done) => {
  ToDo.remove({}).then(() => {
     ToDo.insertMany(todoData);
  }).then(() => done());
};

var populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(userData[0]).save();
    var userTwo = new User(userData[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(() => done());
};

module.exports = {todoData,populateTodos,userData,populateUsers};
