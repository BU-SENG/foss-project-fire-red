const Message = require("../models/message");

// Get summary metrics - SIMPLIFIED
const getDashboardSummary = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ status: 'new' });
    const responded = await Message.countDocuments({ 
      $or: [
        { status: 'reviewed' },
        { status: 'resolved' }
      ]
    });
    const responseRate = total ? (responded / total) * 100 : 0;

    res.json({
      total,
      unread,
      responseRate,
      avgResponseTime: 0, // You can implement this later
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recent submissions
const getRecentFeedback = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback grouped by category
const getFeedbackByCategory = async (req, res) => {
  try {
    const categories = await Message.aggregate([
      { 
        $group: { 
          _id: "$category", 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardSummary, getRecentFeedback, getFeedbackByCategory };