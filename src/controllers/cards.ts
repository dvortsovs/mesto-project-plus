import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  // @ts-ignore
  const owner = req.user;
  Card.create({ name, link, owner })
    .then(() => res.send({ data: 'created' }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ data: 'deleted' }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
