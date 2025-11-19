const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev";

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = Date.now() + 3600000;
    await admin.save();

    const resetURL = `${process.env.FRONTEND_ORIGIN || "http://localhost:3000"}/reset-password/${resetToken}`;
    console.log(`Password reset link for ${email}:`, resetURL);

    return res.json({ message: "Password reset link generated", resetToken, resetURL });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token and newPassword required" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET ALL ADMINS
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-passwordHash');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE NEW ADMIN
const createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ email, passwordHash: hashedPassword, role });
    
    // Return without password
    res.status(201).json({
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ADMIN
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    const updated = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ADMIN
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  login, 
  forgotPassword, 
  resetPassword, 
  getAdmins, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin 
};