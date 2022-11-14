import { Router } from 'express';
import {
  addLike, createCard, deleteCard, deleteLike, getCards,
} from '../controllers/cards';
import { cardIdValidation, createCardValidation } from '../services/request-validation';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', cardIdValidation, addLike);
router.delete('/:cardId/likes', cardIdValidation, deleteLike);

export default router;
