import React from 'react';

const TransactionTable = ({ transactions, role }) => {
  return (
    <div className="overflow-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="px-6 py-3 border-b border-gray-200">Booking ID</th>
            <th className="px-6 py-3 border-b border-gray-200">Hotel Name</th>
            <th className="px-6 py-3 border-b border-gray-200">Guest Name</th>
            <th className="px-6 py-3 border-b border-gray-200">Check-in Date</th>
            <th className="px-6 py-3 border-b border-gray-200">Check-out Date</th>
            <th className="px-6 py-3 border-b border-gray-200">Total Price</th>
            {role === 'admin' && <th className="px-6 py-3 border-b border-gray-200">Admin Revenue</th>}
            {role === 'manager' && <th className="px-6 py-3 border-b border-gray-200">Manager Revenue</th>}
            <th className="px-6 py-3 border-b border-gray-200">Created At</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {transactions.map((transaction, index) => (
            <tr
              key={transaction.bookingId}
              className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <td className="px-6 py-4 text-center">{transaction.bookingId}</td>
              <td className="px-6 py-4 text-center">{transaction.hotelName}</td>
              <td className="px-6 py-4 text-center">{transaction.guestName}</td>
              <td className="px-6 py-4 text-center">
                {new Date(transaction.checkInDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center">
                {new Date(transaction.checkOutDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center font-semibold text-green-600">
                ₹{transaction.totalPrice.toLocaleString()}
              </td>
              {role === 'admin' && (
                <td className="px-6 py-4 text-center font-semibold text-blue-600">
                  ₹{transaction.adminRevenue?.toLocaleString()}
                </td>
              )}
              {role === 'manager' && (
                <td className="px-6 py-4 text-center font-semibold text-purple-600">
                  ₹{transaction.managerRevenue?.toLocaleString()}
                </td>
              )}
              <td className="px-6 py-4 text-center">
                {new Date(transaction.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
