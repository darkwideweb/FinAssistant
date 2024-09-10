import React from 'react';
import { Typography } from 'antd'; 
import LoanCalculator from '../components/LoanCalculator';

const { Title } = Typography; 

const Loans = () => (
  <div style={{ padding: '24px', background: '#f5f5f5' }}>
    <Title level={1} style={{ textAlign: 'center', color: '#333' }}>Кредиты</Title>
    <LoanCalculator />
  </div>
);

export default Loans;
