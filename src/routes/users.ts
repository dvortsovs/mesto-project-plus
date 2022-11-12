import { Router } from 'express';
import {
  getCurrentUser,
  getUser, getUsers, updateAvatar, updateUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
