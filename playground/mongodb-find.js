// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to the TodoApp DB');
  }
  console.log('Connected to the Todo database');

  // db.collection('ToDos').find({_id: new ObjectID("59d5b761dfe46b0b2dc03855")}).toArray().then((docs) => {
  //   console.log("Here are our ToDos:");
  //   console.log(JSON.stringify(docs,undefined,2));
  // }, (err) => {
  //   if(err) {
  //     console.log('There was an error',err);
  //   }
  // });

  db.collection('Users').find({name: 'Jeff'}).toArray().then((docs) => {
    console.log("Here are the entries with Jeff:");
    console.log(JSON.stringify(docs,undefined,2));
  }, (err) => {
    if(err) {
      console.log('There was an error',err);
    }
  });

  db.collection('Users').find().count().then((count) => {
    console.log(`The count of Users is ${count}`);
  }, (err) => {
    if(err) {
      console.log('There was an error',err);
    }
  });

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
