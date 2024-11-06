import cors from 'cors';
import "dotenv/config";
import express from "express";
import mongoose from 'mongoose';

import adminRouter from './routes/adminRoutes.js';
import managerRouter from './routes/managerRoutes.js';
import userRouter from './routes/userRoutes.js';

mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
