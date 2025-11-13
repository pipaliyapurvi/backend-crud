// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   username: String,
//   email: { type: String, unique: true },
//   password: String,
//   age: Number,
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  age: Number
}, {
  timestamps: true   // <-- automatically adds createdAt & updatedAt
});

module.exports = mongoose.model('user', userSchema);

