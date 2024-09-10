import React, { useState } from 'react';
import { InputNumber, Tooltip } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import './AmountInput.css';

const AmountInput = ({ onAmountChange }) => {
  const [amount, setAmount] = useState(0);

  const handleChange = value => {
    const sanitizedValue = value ? Math.max(0, value) : 0;
    setAmount(sanitizedValue);
    onAmountChange(sanitizedValue);
  };

  return (
    <div className="amount-input-container">
      <Tooltip title="Введите сумму для обмена">
        <InputNumber
          min={0}
          value={amount}
          onChange={handleChange}
          placeholder="Введите сумму"
          prefix={<DollarOutlined />}
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </Tooltip>
    </div>
  );
};

export default AmountInput;
