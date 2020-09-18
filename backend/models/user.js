const mongoose = require('mongoose');
// plugin that checks data before saving it
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// validator that gives us an error if user try to create
// an account with an already existing email
userSchema.plugin(uniqueValidator);

// collection will be called 'posts', the plural of 'Post'
module.exports = mongoose.model('User', userSchema);
