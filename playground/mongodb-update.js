// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to the TodoApp DB');
  }
  console.log('Connected to the Todo database');

  // db.collection('ToDos').findOneAndUpdate({_id: new ObjectID("59d6678976fe362708e9418e")}, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((res) => {
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate({_id: new ObjectID("59d51a68927b530a600397f6")}, {
    $set: {
      name: 'Sam'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(res);
  });

  // db.close();

});
