import React from 'react';

function Dashboard(){
  return (
    <>
        <h1 className="text-black text-4xl font-bold mb-5">Admin Dashboard</h1>
        <main className="flex-grow p-6">
        <header className="flex justify-between items-center mb-6">
      
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Cards or components for displaying statistics */}
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-xl font-bold">Total Users</h3>
              <p className="text-2xl">1,200</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-xl font-bold">Total Managers</h3>
              <p className="text-2xl">50</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-xl font-bold">Total Hotels</h3>
              <p className="text-2xl">30</p>
            </div>
          </div>
        </section>
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          {/* Table or list for recent activity */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Activity</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">User registered</td>
                <td className="border px-4 py-2">2024-10-07</td>
                <td className="border px-4 py-2">John Doe</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Manager created</td>
                <td className="border px-4 py-2">2024-10-06</td>
                <td className="border px-4 py-2">Jane Smith</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
