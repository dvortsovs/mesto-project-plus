import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { SessionRequest } from '../types/session-request-middleware-type';
import { getCurrentUserId } from '../services/utils';
import NotFoundError from '../services/errors/not-found-error';
import ForbiddenError from '../services/errors/forbidden-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = getCurrentUserId(req);
  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

export const deleteCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    const owner = getCurrentUserId(req);
    if (String(card.owner) === owner) {
      card.delete()
        .then(() => res.send({ message: 'success' }))
        .catch(next);
    } else {
      throw new ForbiddenError('Попытка удалить чужую карточку');
    }
  })
  .catch(next);

export const addLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const card = req.params.cardId;
  const owner = getCurrentUserId(req);
  Card.findByIdAndUpdate(card, { $addToSet: { likes: owner } }, { new: true, runValidators: true })
    .then((updateCard) => {
      if (!updateCard) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(updateCard);
    })
    .catch(next);
};

export const deleteLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  const card = req.params.cardId;
  const owner = getCurrentUserId(req);
  Card.findByIdAndUpdate(card, { $pull: { likes: owner } }, { new: true, runValidators: true })
    .then((updateCard) => {
      if (!updateCard) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(updateCard);
    })
    .catch(next);
};
