import React from 'react';
import { Card } from 'antd';
import './ExchangeResult.css';

const { Meta } = Card;

const ExchangeResult = ({ fromCurrency, toCurrency, amount, result, rate }) => (
  <Card className="exchange-result">
    <Meta
      title={`Обмен ${amount} ${fromCurrency} на ${toCurrency}`}
      description={`Результат обмена: ${result} ${toCurrency} (Курс: ${rate.toFixed(2)})`}
      className="exchange-meta"
    />
  </Card>
);

export default ExchangeResult;
