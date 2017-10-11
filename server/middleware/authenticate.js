const {User} = require('../models/user');

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    req.user = user;
    req.token = token;
    next();
  })
  .catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};