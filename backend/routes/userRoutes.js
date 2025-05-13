const User = require('../models/user');
const Store = require('../models/store');
const Rating = require('../models/rating');

// Get all stores (search + rating info)
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    // For each store, fetch the average rating
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ store: store._id });
        const averageRating = ratings.length
          ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
          : 0;
        return { ...store.toObject(), averageRating };
      })
    );
    res.status(200).json(storesWithRatings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

// Submit or update a rating
exports.submitOrUpdateRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;

  try {
    const existingRating = await Rating.findOne({ user: req.user.id, store: storeId });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated successfully' });
    }

    const newRating = new Rating({
      user: req.user.id,
      store: storeId,
      rating,
    });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting/updating rating' });
  }
};

// Get the user's rating for a specific store
exports.getUserRating = async (req, res) => {
  const { storeId } = req.params;

  try {
    const rating = await Rating.findOne({ user: req.user.id, store: storeId });
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rating' });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
};
