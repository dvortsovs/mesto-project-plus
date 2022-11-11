import { model, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (e: string) => validator.isEmail(e),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

export default model<IUser>('User', userSchema);
