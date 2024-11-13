import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDays: {
      type: Number,
      required: true,
      min:1,
    },
    transactionId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed", "cancellation_pending"],
      default: "pending",
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    revenueDistribution: {
      admin: Number, 
      manager: Number 
    },
    userCredentials: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      idType: {
        type: String,
        enum: ["Aadhar", "Passport", "Driving License"],
        required: true,
      },
      idPhoto: {
        type:  [String],
        required: true,
      },
    },
    cancellationRequest: {
      type: Schema.Types.ObjectId,
      ref: "CancellationModel",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;