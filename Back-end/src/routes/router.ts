import express from 'express';
import imagerouter from './api/images';

const router = express.Router();

router.use('/images', imagerouter);

export default router;
