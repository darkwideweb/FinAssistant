import React, { useState } from 'react';
import CurrencySelector from './CurrencySelector';
import AmountInput from './AmountInput';
import ExchangeResult from './ExchangeResult';
import CurrencyRates from './CurrencyRates';
import './Currency.css';

const Currency = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'RUB'];

  const handleCurrencyChange = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleAmountChange = value => {
    setAmount(value);
  };

  const handleRatesFetched = newRate => {
    setRate(newRate);
    if (amount > 0 && newRate !== null) {
      setResult(amount * newRate);
    }
  };

  // Места обмена валют
  const exchangeLinks = [
    { name: 'Сбербанк', url: 'https://www.sberbank.ru' },
    { name: 'ВТБ', url: 'https://www.vtb.ru' },
    { name: 'Альфа-Банк', url: 'https://www.alfabank.ru' },
    { name: 'Тинькофф', url: 'https://www.tinkoff.ru' },
    { name: 'РТС', url: 'https://www.rts.ru' },
  ];

  return (
    <div className="currency-container">
      <h1 className="currency-header">Обмен валют</h1>
      <div className="currency-content">
        <CurrencySelector currencies={currencies} onChange={handleCurrencyChange} />
        <AmountInput onAmountChange={handleAmountChange} />
        <CurrencyRates fromCurrency={fromCurrency} toCurrency={toCurrency} onRatesFetched={handleRatesFetched} />
        {result !== null && (
          <ExchangeResult fromCurrency={fromCurrency} toCurrency={toCurrency} amount={amount} result={result} rate={rate} />
        )}
      </div>
      <div className="exchange-links">
        <h2>Актуальные места обмена валют:</h2>
        <ul>
          {exchangeLinks.map(link => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Currency;
