import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mydb');

app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
