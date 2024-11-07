import crypto from 'crypto';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/bookingModel.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createBooking(req, res) {
    try {
        const {
            hotelId,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
        } = req.body;

        const user = req.user; 
        console.log("user:", user);

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { _id: userId, name, email, phone } = user;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const totalDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        const userCredentials = {
            name,
            email,
            phone,
            idType: 'Aadhar', 
            idPhoto
        };

        const newBooking = new Booking({
            user: userId,
            hotel: hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests,
            totalPrice,
            totalDays,
            transactionId: uuidv4(),
            status: 'pending',
            userCredentials,
        });

        const savedBooking = await newBooking.save();

        const options = {
            amount: totalPrice * 100, 
            currency: 'INR',
            receipt: savedBooking._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            booking: savedBooking,
            orderId: order.id,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error });
    }
}


export async function verifyPayment(req, res) {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const bookingId = req.body.bookingId;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature === razorpaySignature) {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    status: 'completed',
                    transactionId: razorpayPaymentId,
                    paymentMethod: 'Razorpay',
                    paymentDate: new Date(),
                },
                { new: true }
            );

            res.status(200).json({
                message: 'Payment verified and booking completed successfully',
                booking: updatedBooking,
            });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Failed to verify payment', error });
    }
}
