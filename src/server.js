// ==========================================
// 1. CÁC MIDDLEWARE 
// ==========================================
// Cấu hình CORS linh hoạt cho Production và Local
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); // Đọc dữ liệu JSON từ req.body