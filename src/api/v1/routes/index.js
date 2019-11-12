import express from 'express';

const router = express.Router();

// default response to base URL
router.get('/', (req, res) => {
  res.status(200).send('Teamwork V1');
});

export default router;
