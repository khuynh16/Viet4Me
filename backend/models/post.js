const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  engTranslation: { type: String, required: true },
  vietTranslation: { type: String },
  categories: { type: Array, required: true }
});

// collection will be called 'posts', the plural of 'Post'
module.exports = mongoose.model('Post', postSchema);
