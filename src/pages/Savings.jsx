import React from 'react';
import SavingsCalculator from '../components/SavingsCalculator';
import '../styles/Savings.css'; 

const Savings = () => (
  <div className="savings-container">
    <h1 className="savings-header">Сбережения</h1>
    <SavingsCalculator />
  </div>
);

export default Savings;
