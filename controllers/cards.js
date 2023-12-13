const Card = require('../models/card');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;
const SUCCESS_CREATED = 201;

module.exports.getCardList = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cardList) => res.send({ data: cardList }))
    .catch((error) => res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardObject) => res.status(SUCCESS_CREATED).send({ data: cardObject }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};
