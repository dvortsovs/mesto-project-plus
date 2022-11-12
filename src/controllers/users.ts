import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../constants/errors';
import { SessionRequest } from '../types/session-request-middleware-type';
import { getCurrentUserId } from '../services/utils';

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

export const getCurrentUser = (req: SessionRequest, res: Response) => {
  const owner = getCurrentUserId(req);
  return User.find({ _id: owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true }).send({
        message: 'login successful',
      });
    })
    .catch((err) => res.status(401).send(err));
};

export const createUser = (req: Request, res: Response) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const updateUser = (req: SessionRequest, res: Response) => {
  const { name, about } = req.body;
  const id = getCurrentUserId(req);
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

export const updateAvatar = (req: SessionRequest, res: Response) => {
  const { avatar } = req.body;
  const id = getCurrentUserId(req);
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
