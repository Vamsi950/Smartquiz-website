const User = require('../models/User'); 
const Result = require('../models/Result'); 

// Controller to get all non-admin users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }); 
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await User.findById(userId);
    
    // Prevent admin from deleting another admin
    if (userToDelete && userToDelete.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Controller to get user results along with user details (populating userId)
exports.getUserResults = async (req, res) => {
  try {
    const userResults = await Result.find()
      .populate('userId', 'name email role') 
      .exec();
    res.status(200).json({ userResults });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
