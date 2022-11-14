import { Router } from 'express';
import {
  getCurrentUser,
  getUser, getUsers, updateAvatar, updateUser,
} from '../controllers/users';
import { updateAvatarValidation, updateUserValidation, userIdValidation } from '../services/request-validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidation, getUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

export default router;
