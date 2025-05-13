const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }, // Ensure unique email
  address: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Virtual to calculate the average rating of the store
storeSchema.virtual('averageRating', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'store',
  justOne: false,
  options: [{ $group: { _id: '$store', averageRating: { $avg: '$rating' } } }]
});

module.exports = mongoose.model('Store', storeSchema);
