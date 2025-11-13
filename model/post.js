// // models/post.js
// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   title: String,
//   body: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true   // <-- adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('Post', postSchema);
