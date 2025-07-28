const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

exports.createTodo = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Todo text required' });

  try {
    const todo = await Todo.create({ text, user: req.user.id });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
