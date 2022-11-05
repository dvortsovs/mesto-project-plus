import { Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

export default router;
