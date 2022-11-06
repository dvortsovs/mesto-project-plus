import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mydb');

app.use((req, res, next) => {
  // @ts-ignore
  req.user = {
    _id: '63663c5cbab251fc534987c5', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/user', userRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
