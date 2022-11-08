import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import User from '../models/user';
import { TRequest } from '../types/request-middleware-type';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../constants/errors';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));

export const getUser = (req: Request, res: Response) => User.find({ _id: req.params.userId })
  .then((user) => {
    if (user) {
      return res.send({ data: user });
    }
    return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const updateUser = (req: Request & TRequest<ObjectId>, res: Response) => {
  const { name, about } = req.body;
  const id = req.user;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const updateAvatar = (req: Request & TRequest<ObjectId>, res: Response) => {
  const { avatar } = req.body;
  const id = req.user;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};
