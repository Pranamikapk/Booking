import mongoose from "mongoose";
const { Schema } = mongoose;

const cancellationSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CancellationModel = mongoose.model('CancellationModel', cancellationSchema);
export default CancellationModel;
