require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Correct path to your Admin model
const Admin = require("../models/admin");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD ;

  // Check if admin exists
  if (await Admin.findOne({ email })) {
    console.log("Admin already exists:", email);
    return process.exit(0);
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create admin
  await Admin.create({ email, passwordHash: hash });

  console.log("Admin created:", email);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
