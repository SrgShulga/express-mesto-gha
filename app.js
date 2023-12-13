const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const mongoDB = 'mongodb://localhost:27017/mestodb';
mongoose.connect(mongoDB);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6578c59fe2402f097e224eec',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Адрес сервера — http://${BASE_PATH}:${PORT}`);
});
