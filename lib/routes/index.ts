import { Router, Request, Response, NextFunction } from 'express';

import { room } from './room';

const router = Router();

router.use(room);

export { router as appRouter };
