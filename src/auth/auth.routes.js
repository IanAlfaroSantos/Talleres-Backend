import { Router } from 'express';
import { validarFirebaseToken } from '../middlewares/validar-firebase-token.js';
import { getSession } from './auth.controller.js';

const router = Router();
router.get('/session', validarFirebaseToken, getSession);
export default router;
