const User = require('../models/user');
const Store = require('../models/store');

// Get Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const storesCount = await Store.countDocuments();
    res.status(200).json({ usersCount, storesCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Create a new user (admin only)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Get all users with filters
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(req.query); // Example: can filter based on query params
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Create a new store (admin only)
exports.createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const newStore = new Store({ name, email, address, owner: ownerId });
    await newStore.save();
    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (err) {
    res.status(500).json({ message: 'Error creating store' });
  }
};

// Get all stores with filters
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find(req.query); // Example: can filter based on query params
    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};
