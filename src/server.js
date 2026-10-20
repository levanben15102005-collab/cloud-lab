const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Khởi tạo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api', studentRoutes);

// Route kiểm tra server
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MERN Backend đang hoạt động!'
  });
});

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Chưa cấu hình biến môi trường MONGODB_URI');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('Kết nối MongoDB thành công');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server đang chạy tại port ${PORT}`);
    });
  } catch (err) {
    console.error('Lỗi khởi động server:', err.message);
    process.exit(1);
  }
}

startServer();