import React from 'react';
import ExpenseTracker from '../components/ExpenseTracker';
import '../styles/Transactions.css'; 

const Transactions = () => (
  <div className="transactions-container">
    <h1 className="transactions-header">Транзакции</h1>
    <div className="expense-tracker-container">
      <ExpenseTracker />
    </div>
  </div>
);

export default Transactions;
