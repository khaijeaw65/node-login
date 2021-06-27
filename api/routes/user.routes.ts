import express from 'express';
import {register, getUser, getById} from '../controller/user.controller'

const router = express.Router();

router.get('/', getUser)
router.get('/getById/:id', getById);
router.post('/register', register);

export default router;

