import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyRates.css';

const CurrencyRates = ({ fromCurrency, toCurrency, onRatesFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rate = response.data.rates[toCurrency];
        if (rate) {
          onRatesFetched(rate);
        } else {
          setError('Курс валют недоступен.');
        }
      } catch (error) {
        setError('Ошибка получения курсов валют');
        console.error('Ошибка получения курсов валют', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency, onRatesFetched]);

  if (loading) return <div className="loading">Загрузка курсов...</div>;
  if (error) return <div className="error">{error}</div>;

  return null;
};

export default CurrencyRates;
