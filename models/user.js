const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Unauthorized = require('../utils/error-response/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    minlength: 4,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Ошибка при передаче аватара пользователя',
    },
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Почта пользователя введена неверно',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены неверно')); }
      return bcrypt.compare(password, user.password).then((correct) => {
        if (!correct) { return Promise.reject(new Unauthorized('Имя пользователя или (-и) пароль введены неверно')); }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
