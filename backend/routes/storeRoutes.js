const Store = require('../models/store');
const Rating = require('../models/rating');

// Get the ratings received by the store
exports.getMyStoreRatings = async (req, res) => {
  try {
    const storeRatings = await Rating.find({ store: req.store._id }).populate('user', 'name');
    res.status(200).json(storeRatings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

// Get the average rating of the store
exports.getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ store: req.store._id });
    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    res.status(200).json({ averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating average rating' });
  }
};
