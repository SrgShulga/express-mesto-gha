const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const mainRouter = require('./routes/index');

const app = express();

const errorHandler = require('./middlewares/error-handler');

const mongoDB = 'mongodb://localhost:27017/mestodb';
mongoose.connect(mongoDB);

app.use(express.json());

app.use(mainRouter);

app.use(errorHandler);
app.use(errors());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Адрес сервера — http://${BASE_PATH}:${PORT}`);
});
