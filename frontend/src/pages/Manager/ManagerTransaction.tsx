import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import TransactionTable from '../../components/ui/TransactionTable';

let API_URL = 'http://localhost:3000'

const ManagerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error,setError] = useState('')
  const token = useSelector((state: RootState)=> state.managerAuth.manager?.token)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!token) {
          setError('Authorization token is missing. Please log in.');
          console.log('Authorization token is missing. Please log in.');
          return;
          
        }
        const response = await fetch(`${API_URL}/manager/transactions`,{
            headers:{
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${token}`
            }
        });
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching manager transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manager Transactions</h2>
      <TransactionTable transactions={transactions} role="manager" />
    </div>
  );
};

export default ManagerTransactions;
