require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://mern-frontend-236822.onrender.com',
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
app.use(express.urlencoded({ extended: true }));

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [true, 'MSSV khong duoc de trong'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Ho ten khong duoc de trong'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email khong duoc de trong'],
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

const Student = mongoose.models.Student ||
    mongoose.model('Student', studentSchema);

const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL;

let mongoReady = false;

mongoose.connection.on('connected', () => {
    mongoReady = true;
    console.log('MongoDB Atlas da ket noi!');
});

mongoose.connection.on('disconnected', () => {
    mongoReady = false;
    console.log('MongoDB da ngat ket noi!');
});

mongoose.connection.on('error', (error) => {
    mongoReady = false;
    console.error('Loi MongoDB:', error.message);
});

async function connectDB() {
    if (!MONGO_URI) {
        throw new Error(
            'Thieu MONGO_URI trong Environment cua Render'
        );
    }

    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000
    });

    mongoReady = true;
    console.log('Ket noi MongoDB Atlas thanh cong!');
}

function checkDB(req, res, next) {
    if (
        !mongoReady ||
        mongoose.connection.readyState !== 1
    ) {
        return res.status(503).json({
            message: 'MongoDB chua ket noi. Vui long thu lai sau.'
        });
    }

    next();
}

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Backend MERN da chay thanh cong!',
        status: 'OK',
        database: mongoReady ? 'connected' : 'disconnected'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        server: 'running',
        database: mongoReady ? 'connected' : 'disconnected'
    });
});

app.get('/api/students', checkDB, async (req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 });

        return res.status(200).json(students);
    } catch (error) {console.error('Loi lay danh sach:', error.message);

        return res.status(500).json({
            message: 'Loi lay danh sach sinh vien'
        });
    }
});

app.get('/api/students/:id', checkDB, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'ID sinh vien khong hop le'
            });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: 'Khong tim thay sinh vien'
            });
        }

        return res.status(200).json(student);
    } catch (error) {
        console.error('Loi tim sinh vien:', error.message);

        return res.status(500).json({
            message: 'Loi tim sinh vien'
        });
    }
});

app.post('/api/students', checkDB, async (req, res) => {
    try {
        const { studentId, name, email } = req.body;

        if (
            typeof studentId !== 'string' ||
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            !studentId.trim() ||
            !name.trim() ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: 'Vui long nhap MSSV, ho ten va email hop le'
            });
        }

        const student = await Student.create({
            studentId: studentId.trim(),
            name: name.trim(),
            email: email.trim()
        });

        return res.status(201).json({
            message: 'Them sinh vien thanh cong',
            student: student
        });
    } catch (error) {
        console.error('Loi them sinh vien:', error.message);

        return res.status(400).json({
            message: 'Loi them sinh vien',
            error: error.message
        });
    }
});

app.put('/api/students/:id', checkDB, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'ID sinh vien khong hop le'
            });
        }

        const { studentId, name, email } = req.body;
        const updateData = {};

        if (studentId !== undefined) {
            if (typeof studentId !== 'string' || !studentId.trim()) {
                return res.status(400).json({
                    message: 'MSSV khong hop le'
                });
            }
            updateData.studentId = studentId.trim();
        }

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    message: 'Ho ten khong hop le'
                });
            }
            updateData.name = name.trim();
        }

        if (email !== undefined) {
            if (typeof email !== 'string' || !email.trim()) {
                return res.status(400).json({
                    message: 'Email khong hop le'
                });}
            updateData.email = email.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: 'Khong co thong tin can cap nhat'
            });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
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

        return res.status(200).json({
            message: 'Cap nhat sinh vien thanh cong',
            student: updatedStudent
        });
    } catch (error) {
        console.error('Loi cap nhat:', error.message);

        return res.status(400).json({
            message: 'Loi cap nhat sinh vien',
            error: error.message
        });
    }
});

app.delete('/api/students/:id', checkDB, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: 'ID sinh vien khong hop le'
            });
        }

        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Khong tim thay sinh vien'
            });
        }

        return res.status(200).json({
            message: 'Xoa sinh vien thanh cong',
            student: deletedStudent
        });
    } catch (error) {
        console.error('Loi xoa sinh vien:', error.message);

        return res.status(500).json({
            message: 'Loi xoa sinh vien',
            error: error.message
        });
    }
});

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server dang chay tren port ${PORT}`);
        });
    } catch (error) {
        console.error('Khoi dong server that bai:', error.message);
        process.exit(1);
    }
}

startServer();