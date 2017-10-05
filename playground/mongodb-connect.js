// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to the TodoApp DB');
  }
  console.log('Connected to the Todo database');

  // db.collection('ToDos').insertOne({text: 'Some task', completed: false}, (err,res) => {
  //   if(err) {
  //     return console.log('Error encountered on insert: ', err);
  //   }
  //   console.log(JSON.stringify(res.ops,undefined,2));
  // });

//   db.collection('Users').insertOne({name: 'Jeff', age: 60, loc: 'broomfield'}, (err,res) => {
//     if(err) {
//       return console.log('Error encountered on insert: ', err);
//     }
//
//     console.log(res.ops[0]._id.getTimestamp());
//   });
   db.close();
});
