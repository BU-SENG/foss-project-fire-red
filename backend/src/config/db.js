const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

const connectDB = async () => {
    await mongoose. connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error(`'MongoDB connection error:', ${error.message}`);
        process.exit(1);
    })

}

module.exports = connectDB;