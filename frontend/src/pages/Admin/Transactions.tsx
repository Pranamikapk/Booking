import React, { useEffect, useState } from 'react';
import TransactionTable from '../../components/ui/TransactionTable';

let API_URL = 'http://localhost:3000'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/transactions`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching admin transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
        <h1 className="text-black text-4xl font-bold mb-5">Transactions</h1>
        <TransactionTable transactions={transactions} role="admin" />
    </div>
  );
};

export default Transactions;
