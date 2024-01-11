const Card = require('../models/card');

const { SUCCESS_CREATED } = require('../utils/response-status');

const NotFound = require('../utils/error-response/NotFound');
const BadRequest = require('../utils/error-response/BadRequest');
const Forbidden = require('../utils/error-response/Forbidden');

module.exports.getCardList = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cardList) => res.send({ data: cardList }))
    .catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardObject) => res.status(SUCCESS_CREATED).send({ data: cardObject }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else { next(error); }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((selectedCard) => {
      if (!selectedCard) { next(new NotFound('Карточка по указанному _id не найдена')); }
      if (!selectedCard.owner.equals(req.user._id)) { next(new Forbidden('Вы не являетесь автором карточки, удаление невозможно')); }
      Card.findByIdAndDelete(req.params.cardId)
        .onFail(() => new NotFound('Карточка по указанному _id не найдена'))
        .then(() => { res.send({ message: 'Карточка успешно удалена с сервера' }); });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные карточки'));
      } else { next(error); }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else { next(new NotFound('Карточка по указанному _id не найдена')); }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else { next(error); }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        next(new NotFound('Карточка по указанному _id не найдена'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятии лайка'));
      } else { next(error); }
    });
};
