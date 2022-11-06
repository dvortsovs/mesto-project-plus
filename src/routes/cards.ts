import { Router } from 'express';
import {
  addLike, createCard, deleteCard, deleteLike, getCards,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);

export default router;
