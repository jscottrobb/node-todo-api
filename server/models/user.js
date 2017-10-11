const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = mongoose.Schema({
  email: {
     type: String,
     required: true,
     minlength: 1,
     trim: true,
     unique: true,
     validate: {
       validator: validator.isEmail,
       message: '{VALUE} is not a valid email'
     }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
       type: String,
       required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.genAuthToken = function () {
   var user = this;
   var access = 'auth';
   var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();
   user.tokens.push({access,token});

   return user.save().then(() => {
     return token;
   });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password,user.password, (err, res) => {
        if (res === true) {
          resolve(user);
        }
        else {
          reject();
        }
      });
    });
  });
};

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
      decoded = jwt.verify(token,'secret');
    } catch (e) {
       return Promise.reject();
    }

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};
var User = mongoose.model('User', UserSchema);

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10,(err, salt) => {
      bcrypt.hash(user.password,salt,(err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }
});

module.exports = {User};
