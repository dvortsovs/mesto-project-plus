import { Request, Response } from 'express';
import Card from '../models/card';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../constants/errors';
import { SessionRequest } from '../types/session-request-middleware-type';
import { getCurrentUserId } from '../services/utils';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));

export const createCard = (req: SessionRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = getCurrentUserId(req);
  return Card.create({ name, link, owner })
    .then(() => res.send({ data: 'created' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const deleteCard = (req: SessionRequest, res: Response) => Card.findById(req.params.cardId)
  .then((card) => {
    if (card) {
      const owner = getCurrentUserId(req);
      if (String(card.owner) === owner) {
        return card.delete().then(() => res.send({ data: 'success' }));
      }
    }
    return Promise.reject();
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  });

export const addLike = (req: SessionRequest, res: Response) => {
  const card = req.params.cardId;
  const owner = getCurrentUserId(req);
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

export const deleteLike = (req: SessionRequest, res: Response) => {
  const card = req.params.cardId;
  const owner = getCurrentUserId(req);
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
