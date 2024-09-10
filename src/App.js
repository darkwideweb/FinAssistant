import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Savings from './pages/Savings';
import Investments from './pages/Investments';
import Budget from './pages/Budget';
import Loans from './pages/Loans';
import Currency from './components/Currency/Currency';
import Quiz from './components/Quiz';

const App = () => (
  <Router>
    <MainLayout>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/quiz" element={<Quiz />} /> 
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
