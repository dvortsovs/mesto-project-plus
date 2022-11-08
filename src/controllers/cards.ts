import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { TRequest } from '../types/request-middleware-type';
import Card from '../models/card';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../constants/errors';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));

export const createCard = (req: Request & TRequest<ObjectId>, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user;
  return Card.create({ name, link, owner })
    .then(() => res.send({ data: 'created' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (card) {
      return res.send({ data: 'deleted' });
    }
    return Promise.reject();
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });

export const addLike = (req: Request & TRequest<ObjectId>, res: Response) => {
  const card = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(card, { $addToSet: { likes: owner } }, { new: true, runValidators: true })
    .then((updateCard) => {
      if (updateCard) {
        return res.send(updateCard);
      }
      return Promise.reject();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const deleteLike = (req: Request & TRequest<ObjectId>, res: Response) => {
  const card = req.params.cardId;
  const owner = req.user?._id;
  Card.findByIdAndUpdate(card, { $pull: { likes: owner } }, { new: true, runValidators: true })
    .then((updateCard) => {
      if (updateCard) {
        return res.send(updateCard);
      }
      return Promise.reject();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};
