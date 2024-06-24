import { Router } from 'express';
import { identifyContactController } from '../controllers/identify.controller';

const identifyRouter = Router();

identifyRouter.post('/', identifyContactController);

export default identifyRouter;
