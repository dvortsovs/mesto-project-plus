import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  // @ts-ignore
  const owner = req.user;
  return Card.create({ name, link, owner })
    .then(() => res.send({ data: 'created' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then(() => res.send({ data: 'deleted' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(500).send({ message: err.message });
  });

export const addLike = (req: Request, res: Response) => {
  const card = req.params.cardId;
  // @ts-ignore
  const owner = req.user._id;
  Card.findByIdAndUpdate(card, { $addToSet: { likes: owner } }, { new: true })
    .then((updateCard) => res.send(updateCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(500).send({ message: err.message });
    });
};

export const deleteLike = (req: Request, res: Response) => {
  const card = req.params.cardId;
  // @ts-ignore
  const owner = req.user._id;
  Card.findByIdAndUpdate(card, { $pull: { likes: owner } }, { new: true })
    .then((updateCard) => res.send(updateCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(500).send({ message: err.message });
    });
};
