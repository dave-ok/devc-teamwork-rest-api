import express from 'express';
import feedCtrl from '../../controllers/feedController';

const feedRouter = express.Router();

feedRouter.get('/', feedCtrl.viewAll);

export default feedRouter;
