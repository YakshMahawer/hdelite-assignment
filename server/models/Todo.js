const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', TodoSchema);
