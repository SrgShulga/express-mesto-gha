const cardRouter = require('express').Router();

const {
  getCardList, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  validateCardId, validateCreateCard,
} = require('../utils/validation');

cardRouter.get('/', getCardList);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;
