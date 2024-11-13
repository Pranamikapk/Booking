import Booking from "../models/bookingModel.js";
import Manager from "../models/managerModel.js";

export async function getAdminTransactions(req, res) {
    try {
        const transactions = await Booking.find({ status: 'completed' })
            .populate('user', 'name email')
            .populate('hotel', 'name address')
            .sort({ createdAt: -1 });
        
        const adminTransactions = transactions.map(transaction => ({
            bookingId: transaction._id,
            hotelName: transaction.hotel.name,
            guestName: transaction.user.name,
            checkInDate: transaction.checkInDate,
            checkOutDate: transaction.checkOutDate,
            totalPrice: transaction.totalPrice,
            adminRevenue: transaction.revenueDistribution.admin,
            createdAt: transaction.createdAt
        }));
        console.log(adminTransactions);
        
        res.status(200).json(adminTransactions);
    } catch (error) {
        console.error("Error fetching admin transactions:", error);
        res.status(500).json({ message: 'Error fetching admin transactions' });
    }
}


export async function getManagerTransactions(req, res) {
    const managerId = req.user.id; 

    try {
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        const transactions = await Booking.find({ hotel: { $in: manager.hotels }, status: 'completed' })
            .populate('user', 'name email')
            .populate('hotel', 'name address')
            .sort({ createdAt: -1 });

        const managerTransactions = transactions.map(transaction => ({
            bookingId: transaction._id,
            hotelName: transaction.hotel.name,
            guestName: transaction.user.name,
            checkInDate: transaction.checkInDate,
            checkOutDate: transaction.checkOutDate,
            totalPrice: transaction.totalPrice,
            managerRevenue: transaction.revenueDistribution.manager,
            createdAt: transaction.createdAt
        }));
            console.log(managerTransactions);
            
        res.status(200).json(managerTransactions);
    } catch (error) {
        console.error("Error fetching manager transactions:", error);
        res.status(500).json({ message: 'Error fetching manager transactions' });
    }
}
