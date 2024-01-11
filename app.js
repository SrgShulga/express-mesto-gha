const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { validateUserLogin, validateUserRegister } = require('./utils/validation');
const authGuard = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const NotFound = require('./utils/error-response/NotFound');

const mongoDB = 'mongodb://localhost:27017/mestodb';
mongoose.connect(mongoDB);

app.use(express.json());

app.post('/signin', validateUserLogin, login);
app.post('/signup', validateUserRegister, createUser);

app.use('/users', authGuard, userRouter);
app.use('/cards', authGuard, cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

app.use(errorHandler);
app.use(errors());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Адрес сервера — http://${BASE_PATH}:${PORT}`);
});
