import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/bookingModel.js';
import CancellationModel from '../models/cancellationModel.js';
import Manager from '../models/managerModel.js';


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
            idType,
            idPhoto,
            idPhotoBack,
            paymentOption
        } = req.body;

        const user = req.user;
        console.log("user:", user);

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { _id: userId, name, email, phone } = user;

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ message: 'Invalid check-in or check-out date' });
        }

        const totalDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        if (isNaN(totalDays) || totalDays <= 0) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

        if (!idPhoto) {
            return res.status(400).json({ message: 'ID photo is required' });
        }

        const userCredentials = {
            name,
            email,
            phone,
            idType: idType || 'Aadhar',
            idPhoto,
            idPhotoBack
        };

        const amountPaid = paymentOption === 'partial' ? totalPrice * 0.2 : totalPrice;
        const remainingAmount = totalPrice - amountPaid;

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
            amountPaid, 
            remainingAmount
        });

        const savedBooking = await newBooking.save();


        const options = {
            amount: amountPaid * 100,
            currency: 'INR',
            receipt: savedBooking._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            booking: savedBooking,
            orderId: order.id,
            amountPaid,
            remainingAmount 
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
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


export async function listBookings(req,res){            
    try {
        const userId = req.user?.id        
        const bookings = await Booking.find({user: userId}).populate('hotel'); 
        console.log(bookings);        
        res.status(200).json(bookings);
        } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: 'Error fetching bookings' })
    }
}

export async function bookingDetails(req,res) {
    console.log('params: ',req.params.bookingId);
    
    const  bookingId  = req.params.bookingId

    try {
        console.log("bookingId",bookingId);

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(404).json({ message: "Invalid booking ID format" });
        }
        
        const booking = await Booking.findById(bookingId).populate('hotel')
        console.log('booking',booking);
        
        if(!booking){
            return res.status(400).json({message: "Booking not found"})
        }
        res.status(200).json(booking)
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: 'Error fetching booking details' })
    }
}

export async function listReservations(req, res) {
    console.log('Listing reservations');
    
    try {
        const managerId = req.user.id;
        const manager = await Manager.findById(managerId);        
        if (!manager) {
            console.error("Manager not found with ID:", managerId);
            return res.status(404).json({ message: 'Manager not found' });
        }

        if (!manager.hotelId) {
            console.error("Manager has no associated hotel");
            return res.status(400).json({ message: 'Manager has no associated hotel' });
        }
        
        const reservations = await Booking.find({ hotel: manager.hotelId })
            .populate('user', 'name email phone')
            .populate('hotel', 'name address propertyType placeType ')
            .sort({ checkInDate: 1 });

        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
}

export async function cancelRequest(req, res) {
    const { bookingId, reason } = req.body;
    
    try {
        const newRequest = new CancellationModel({ bookingId, reason });
        await newRequest.save();

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                $set: { 
                    status: 'cancellation_pending',
                    cancellationRequest: {
                        reason: reason,
                        status: 'pending',
                        _id: newRequest._id
                    }
                }
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(201).json({
            message: 'Cancellation request submitted successfully.',
            cancellationRequest: {
                id: newRequest._id,
                bookingId: newRequest.bookingId,
                reason: newRequest.reason,
                status: newRequest.status,
                createdAt: newRequest.createdAt
            },
            updatedBooking: {
                id: updatedBooking._id,
                status: updatedBooking.status
            }
        });
    } catch (error) {
        console.error('Error in cancelRequest:', error);
        res.status(500).json({ message: 'Error submitting cancellation request', error: error.message });
    }
}

export async function cancelApprove(req, res) {
    console.log('inside');
    
    try {
        const booking = await Booking.findById(req.params.bookingId);
        console.log(booking);
        
        if (!booking) {
            return res.status(404).send('Booking not found.');
        }
        booking.cancellationRequest.status = 'approved';
        await booking.save();

        const checkInDate = new Date(booking.checkInDate);
        const currentDate = new Date();
        const timeDiff = checkInDate.getTime() - currentDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        let refundPercentage = 100;
        if (daysDiff < 2) {
            refundPercentage = Math.max(0, 100 - (2 * (2 - daysDiff)));
        }

        const refundAmount = (booking.amountPaid * refundPercentage) / 100 ;

        res.status(200).json({ message: 'Cancellation approved and refund processed.', refundAmount });
    } catch (error) {
        res.status(500).send('Error approving cancellation: ' + error.message);
    }
}

export async function cancelReject(req, res) {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).send('Booking not found.');
        }
        booking.cancellationRequest.status = 'rejected';
        manager.wallet = 
        await booking.save();
        res.status(200).json({ message: 'Cancellation request rejected.' });
    } catch (error) {
        res.status(500).send('Error rejecting cancellation: ' + error.message);
    }
}

