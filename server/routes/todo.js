const express = require('express');
const { getTodos, createTodo, deleteTodo } = require('../controllers/todoController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/', getTodos);
router.post('/', createTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
