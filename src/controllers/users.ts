import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const getUser = (req: Request, res: Response) => User.find({ _id: req.params.userId })
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
