import mongoose from "mongoose";
const { Schema } = mongoose;

const managerSchema = new Schema(
  {
    hotel: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    licence: {
      type: String,
      required: false,
    },
    hotels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
    ],
    token: {
      type: String,
    },
    wallet: {
      type : Number,
      default: 0
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
        type: String,
      },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Manager = mongoose.model("Manager", managerSchema);

export default Manager;
