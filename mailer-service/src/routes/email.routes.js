import { Router } from 'express';
import { postSendEmail } from '../controllers/email.controller.js';

const router = Router();
router.post('/send-email', postSendEmail);

export default router;