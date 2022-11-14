import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SessionRequest } from '../types/session-request-middleware-type';
import { getCurrentUserId } from '../services/utils';
import NotFoundError from '../services/errors/not-found-error';
import RegistrationError from '../services/errors/registration-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findOne({ _id: req.params.userId })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send({ data: user });
  })
  .catch(next);

export const getCurrentUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const owner = getCurrentUserId(req);
  return User.findOne({ _id: owner })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true }).send({
        message: 'login successful',
      });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
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
      if (err.code === 11000) {
        next(new RegistrationError('Этот Email уже используется'));
      }
      next(err);
    });
};

export const updateUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = getCurrentUserId(req);
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const updateAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = getCurrentUserId(req);
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
