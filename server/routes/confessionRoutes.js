const express = require('express');
const {
  createConfession,
  getConfessions,
  getConfession,
  getMyConfessions,
  deleteConfession,
} = require('../controllers/confessionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/my', auth, getMyConfessions);
router.get('/', getConfessions);
router.get('/:id', getConfession);
router.post('/', auth, createConfession);
router.delete('/:id', auth, deleteConfession);

module.exports = router;
