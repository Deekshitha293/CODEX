const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/vyaparai');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Mongo connection failed', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
