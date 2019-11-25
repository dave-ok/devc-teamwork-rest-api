import express from 'express';
import exjwtModule from 'express-jwt';
import checkPermissions from '../middleware/permissions';
import authRouter from './auth';
import gifsRouter from './gifs';
import articlesRouter from './articles';
import feedRouter from './feed';

const router = express.Router();

// initialise jwt middleware
const secretphrase = Buffer.from(process.env.JWT_SECRET || 'our little secret', 'base64');
const exjwt = exjwtModule({
  secret: secretphrase,
});

//whitelist paths - no auth required
const whitelist = [
  '/',
  '/auth/signin' 
];

router.use(exjwt.unless({path: whitelist, useOriginalUrl: false}));


// // define various route/method permissions here
// // --TO-DO-- make this dynamic and persistent from DB?
const routePerms = {
  '/api/v1/auth/create-user': {
    POST: ['admin'],
  },
};

// define routes here
router.get('/testroute', checkPermissions(routePerms), (req, res) => {
  res.status(200).send(`article test ${req.user.permissions}`);
});

router.use('/auth', checkPermissions(routePerms), authRouter);
router.use('/gifs', gifsRouter);
router.use('/articles', articlesRouter);
router.use('/feed', feedRouter);

// default response to base URL
router.get('/', (req, res) => {
  res.status(200).send('Teamwork V1');
});

export default router;
