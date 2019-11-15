import express from 'express';
import exjwtModule from 'express-jwt';
import checkPermissions from '../middleware/permissions';

const router = express.Router();

// initialise jwt middleware
const secretphrase = Buffer.from(process.env.JWT_SECRET || 'our little secret', 'base64');
const exjwt = exjwtModule({
  secret: secretphrase,
});

// // define various route/method permissions here
// // --TO-DO-- make this dynamic and persistent from DB?
const routePerms = {
  '/api/v1/articles': {
    GET: ['admin'],
  },
};

// define routes here
router.get('/articles', exjwt, checkPermissions(routePerms), (req, res) => {
  res.status(200).send(`articles ${req.user.permissions}`);
});

// default response to base URL
router.get('/', (req, res) => {
  res.status(200).send('Teamwork V1');
});

export default router;
