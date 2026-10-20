
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ==========================================
// 1. CAU HINH CORS
// ==========================================
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            process.env.NODE_ENV !== 'production'
        ) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());

// ==========================================
// 2. MODEL SINH VIEN
// ==========================================
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Student = mongoose.models.Student ||
    mongoose.model('Student', studentSchema);

// ==========================================
// 3. KET NOI MONGODB ATLAS
// ==========================================
const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL;

let mongoReady = false;

const connectDB = async () => {
    if (!MONGO_URI) {
        throw new Error(
            'Thieu bien moi truong MONGO_URI, MONGODB_URI hoac MONGODB_URL'
        );
    }

    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    mongoReady = true;
    console.log('Connected to MongoDB Atlas successfully!');
};

mongoose.connection.on('disconnected', () => {
    mongoReady = false;
    console.log('MongoDB disconnected');
});

const checkDB = (req, res, next) => {
    if (!mongoReady || mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'MongoDB chua ket noi. Vui long thu lai sau.'
        });
    }

    next();
};

// ==========================================
// 4. ROUTES
// ==========================================

app.get('/', (req, res) => {
    res.send('Backend MERN da chay thanh cong!');
});

// Lay danh sach sinh vien
app.get('/api/students', checkDB, async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error('Loi lay danh sach:', error.message);
        res.status(500).json({
            message: 'Loi lay danh sach sinh vien',
            error: error.message
        });
    }
});

// Lay sinh vien theo MongoDB ID
app.get('/api/students/:id', checkDB, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: 'Khong tim thay sinh vien'
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({
            message: 'ID sinh vien khong hop le',
            error: error.message
        });
    }
});

// Them sinh vien
app.post('/api/students', checkDB, async (req, res) => {
    try {
        const { studentId, name, email } = req.body;

        if (!studentId || !name || !email) {
            return res.status(400).json({
                message: 'Vui long nhap MSSV, ho ten va email'
            });
        }

        const student = new Student({
            studentId,
            name,
            email
        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: 'Them sinh vien thanh cong',
            student: savedStudent
        });
    } catch (error) {
        console.error('Loi them sinh vien:', error.message);
        res.status(400).json({
            message: 'Loi them sinh vien',
            error: error.message
        });
    }
});

// Cap nhat sinh vien
app.put('/api/students/:id', checkDB, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: 'Khong tim thay sinh vien'
            });
        }

        res.status(200).json({
            message: 'Cap nhat sinh vien thanh cong',
            student: updatedStudent
        });
    } catch (error) {
        res.status(400).json({
            message: 'Loi cap nhat sinh vien',
            error: error.message
        });
    }
});

// Xoa sinh vien
app.delete('/api/students/:id', checkDB, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Khong tim thay sinh vien'
            });
        }

        res.status(200).json({
            message: 'Xoa sinh vien thanh cong',
            student: deletedStudent
        });
    } catch (error) {
        res.status(400).json({
            message: 'Loi xoa sinh vien',
            error: error.message
        });
    }
});

// ==========================================
// 5. KHOI DONG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    connectDB().catch((error) => {
        mongoReady = false;
        console.error('MongoDB connection error:', error.message);
    });
});
