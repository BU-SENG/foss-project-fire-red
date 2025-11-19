const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages.controller"); 
const auth = require("../middleware/auth.middleware"); 

// Public routes
router.get("/", messageController.listMessages);
router.post("/", messageController.createMessage);
router.post("/:id/like", messageController.likeMessage);

// Admin routes
router.put("/:id", auth, messageController.updateMessage);
router.delete("/:id", auth, messageController.deleteMessage);

module.exports = router;