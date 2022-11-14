import {
  Document, Model, model, Schema,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import LoginError from '../services/errors/login-error';
import { linkRegexp } from '../services/request-validation';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials:
    (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
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
    select: false,
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
    validate: {
      validator: (e: string) => linkRegexp.test(e),
      message: 'Неверный формат ссылки',
    },
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new LoginError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new LoginError('Неправильные почта или пароль');
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>('User', userSchema);
