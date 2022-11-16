import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorsHandler from './middlewares/errors-handler';
import { loginValidation, registrationValidation } from './services/request-validation';
import { errorLogger, requestLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', registrationValidation, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
