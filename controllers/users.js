const User = require('../models/user');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;
const SUCCESS_CREATED = 201;

module.exports.getUserList = (req, res) => {
  User.find({})
    .then((userList) => res.send({ data: userList }))
    .catch((error) => res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((selectedUser) => {
      if (selectedUser) {
        res.send({ data: selectedUser });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный _id запрашиваемого пользователя' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userObject) => res.status(SUCCESS_CREATED).send({ data: userObject }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => res.send({ data: updatedData }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((updatedAvatar) => res.send({ data: updatedAvatar }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};
