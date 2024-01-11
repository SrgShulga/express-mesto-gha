const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  DUPLICATE_OBJECT,
  SUCCESS_CREATED,
} = require('../utils/error-status');

const NotFound = require('../utils/error-response/NotFound');
const BadRequest = require('../utils/error-response/BadRequest');
const RequestConflict = require('../utils/error-response/RequestConflict');

module.exports.getUserList = (req, res, next) => {
  User.find({})
    .then((userList) => res.send({ data: userList }))
    .catch((error) => next(error));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((selectedUser) => {
      if (selectedUser) {
        res.send({ data: selectedUser });
      } else { next(new NotFound('Пользователь по указанному _id не найден')); }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Некорректный _id запрашиваемого пользователя'));
      } else { next(error); }
    });
};

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((selectedUser) => {
      if (!selectedUser) {
        next(new NotFound('Пользователь по указанному _id не найден'));
      } else { res.send({ data: selectedUser }); }
    })
    .catch((error) => { next(error); });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  passwordHash.then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then(() => res.status(SUCCESS_CREATED).send({
      name, about, avatar, email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === DUPLICATE_OBJECT) {
        next(new RequestConflict('Пользователь с указанной почтой уже есть в системе'));
      } else { next(error); }
    });
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => res.send({ data: updatedData }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else { next(error); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((selectedUser) => {
      const userToken = jwt.sign({ _id: selectedUser._id }, 'token-generate-key', { expiresIn: '7d' });
      res.send({ userToken });
    })
    .catch((error) => next(error));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((updatedAvatar) => res.send({ data: updatedAvatar }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else { next(error); }
    });
};
