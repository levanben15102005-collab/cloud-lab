const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const studentRoutes = require('./routes/studentRoutes'); 

dotenv.config();

const app = express();

// ==========================================
// 1. CÁC MIDDLEWARE 
// ==========================================
app.use(cors()); // Cho phép Frontend kết nối API
app.use(express.json()); // Đọc dữ liệu JSON từ req.body

// ==========================================
// 2. KHAI BÁO ROUTES 
// ==========================================
app.use('/api', studentRoutes);

// ==========================================
// 3. KẾT NỐI DATABASE VÀ KHỞI ĐỘNG SERVER
// ==========================================
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Tự hủy kết nối sau 5s nếu bị kẹt IP/mạng
})
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});