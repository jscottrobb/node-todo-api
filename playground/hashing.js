const bcrypt = require('bcryptjs');

var password = 'abc123';
var hashStr = '$2a$10$KxpXaXF16siaSLDbDjuB4eKcfgk2n6DS3Rn3spDcGpxbzbP9vWyWS';
bcrypt.genSalt(10,(err, salt) => {
  bcrypt.hash(password,salt,(err, hash) => {
    console.log(hash);
  });
});

bcrypt.compare(password,hashStr,(err, res) => {
  console.log(res);
});

// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');
//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, 'secret');
//
// console.log(token);
//
// var decodedResults = jwt.verify(token,'secret');
//
// console.log(decodedResults);

// var msg = 'user number 3';
//
// var hash = SHA256(msg).toString();
//
// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 3
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('data was not changed');
// }
// else {
//   console.log('data was changed, dont trust');
// }
