const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to the TodoApp DB');
  }
  console.log('Connected to the Todo database');

  // deleteMany
  // db.collection('ToDos').deleteMany({text: 'Eat breakfast'}).then((res) => {
  //   console.log(res);
  // }, (err) => {
  //   if(err) {
  //     console.log('There was an error',err);
  //   }

  // deleteOne
  //   db.collection('ToDos').deleteOne({text: 'Eat breakfast'}).then((res) => {
  //     console.log(res);
  //   }, (err) => {
  //   if(err) {
  //       console.log('There was an error',err);
  //   }
  // });

  //findOneAndDelete
  // db.collection('Users').findOneAndDelete({_id: new ObjectID("59d5a35b605a0825e42ae2d8")}).then((res) => {
  //   console.log(res);
  // });

  db.collection('Users').deleteMany({name: 'Jeff'}).then((res) => {
     console.log(res);
  });


  // db.close();

});
