const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['suggestion', 'complaint', 'appreciation', 'question'],
    default: 'suggestion'
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved'],
    default: 'new'
  },
  type: {
    type: String,
    default: 'public'
  },
  likes: {
    type: Number,
    default: 0
  },
  adminResponse: {
    type: String,
    default: ''
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true // creates createdAt and updatedAt automatically
});

module.exports = mongoose.model('Message', messageSchema);