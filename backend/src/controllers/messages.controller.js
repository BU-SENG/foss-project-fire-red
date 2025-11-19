const Message = require("../models/message");

// Create a new message (Public)
const createMessage = async (req, res) => {
  const { text, category } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Message text is required" });
  }

  try {
    const newMessage = new Message({ 
      text: text.trim(),
      category: category || 'suggestion',
      status: 'new',
      type: 'public',
      likes: 0
    });
    
    await newMessage.save();
    
    // Return the created message
    return res.status(201).json(newMessage);
    
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// List all messages (Public)
const listMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(messages);
    
  } catch (error) {
    console.error("Error listing messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Like a message (Public)
const likeMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.likes += 1;
    await message.save();

    return res.json(message);

  } catch (error) {
    console.error("Error liking message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a message (Admin only)
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { status, adminResponse } = req.body;

  try {
    const updateData = { updatedAt: Date.now() };
    
    if (status) updateData.status = status;
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.adminId; // From auth middleware
    }

    const message = await Message.findByIdAndUpdate(id, updateData, { new: true });

    if (!message) return res.status(404).json({ message: "Message not found" });

    return res.status(200).json(message);
    
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a message (Admin only)
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    return res.status(200).json({ message: "Message deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMessage,
  listMessages,
  likeMessage,
  updateMessage,
  deleteMessage,
};