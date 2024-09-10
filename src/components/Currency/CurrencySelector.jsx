import React, { useState } from 'react';
import { Select, Tooltip } from 'antd';
import './CurrencySelector.css';

const { Option } = Select;

const CurrencySelector = ({ currencies, onChange }) => {
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);

  const handleFromChange = value => {
    setFromCurrency(value);
    onChange(value, toCurrency);
  };

  const handleToChange = value => {
    setToCurrency(value);
    onChange(fromCurrency, value);
  };

  return (
    <div className="currency-selector">
      <Tooltip title="Выберите валюту">
        <Select
          value={fromCurrency}
          onChange={handleFromChange}
          className="currency-select"
          style={{ width: '48%', marginRight: '4%' }}
        >
          {currencies.map(currency => (
            <Option key={currency} value={currency}>
              {currency}
            </Option>
          ))}
        </Select>
      </Tooltip>
      <Tooltip title="Выберите валюту для обмена">
        <Select
          value={toCurrency}
          onChange={handleToChange}
          className="currency-select"
          style={{ width: '48%' }}
        >
          {currencies.map(currency => (
            <Option key={currency} value={currency}>
              {currency}
            </Option>
          ))}
        </Select>
      </Tooltip>
    </div>
  );
};

export default CurrencySelector;
