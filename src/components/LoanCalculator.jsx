import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Result, Tooltip, Tabs, Switch, Divider, List, message } from 'antd';
import { InfoCircleOutlined, CalculatorOutlined, DollarCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../styles/LoanCalculator.css'; 

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, ChartTooltip, Legend);

const { Title: AntTitle } = Typography;

const LoanCalculator = () => {
  const [result, setResult] = useState(null);
  const [totalOverpayment, setTotalOverpayment] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [earlyRepayment, setEarlyRepayment] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const [loans, setLoans] = useState([]);

  const loadLoans = () => {
    const savedLoans = JSON.parse(localStorage.getItem('loans')) || [];
    setLoans(savedLoans);
  };

  const saveLoans = (updatedLoans) => {
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
    setLoans(updatedLoans);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const calculateLoan = (values) => {
    const { amount, rate, term } = values;
    if (amount <= 0 || rate <= 0 || term <= 0) {
      message.error('Пожалуйста, введите корректные значения.');
      return;
    }

    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));
    const totalPayment = earlyRepayment ? (monthlyPayment + Number(extraPayment)) : monthlyPayment;
    const overpayment = (totalPayment * payments - amount).toFixed(2);

    setResult(totalPayment.toFixed(2));
    setTotalOverpayment(overpayment);
    setShowGraph(true);

    const newLoan = {
      amount,
      rate,
      term,
      monthlyPayment: totalPayment.toFixed(2),
      overpayment,
      dateAdded: new Date().toISOString(),
    };

    saveLoans([...loans, newLoan]);
  };

  const removeLoan = (index) => {
    const updatedLoans = loans.filter((_, i) => i !== index);
    saveLoans(updatedLoans);
    message.success('Кредит удален успешно');
  };

  const sortedLoans = loans.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  const graphData = {
    labels: Array.from({ length: 12 * 20 }, (_, i) => `${Math.floor(i / 12)}.${i % 12 + 1}`),
    datasets: [
      {
        label: 'Ежемесячные платежи',
        data: Array(12 * 20).fill(Number(result) || 0),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1,
      },
    ],
  };

  const balanceGraphData = {
    labels: Array.from({ length: 12 * 20 }, (_, i) => `${Math.floor(i / 12)}.${i % 12 + 1}`),
    datasets: [
      {
        label: 'Остаток долга',
        data: Array(12 * 20).fill(earlyRepayment ? 0 : 100000),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} руб.`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="loan-calculator-container">
      <Card className="loan-calculator-card" hoverable>
        <AntTitle level={3} className="loan-calculator-title">
          Калькулятор кредита
        </AntTitle>
        <Form layout="vertical" onFinish={calculateLoan}>
          <Form.Item
            name="amount"
            label="Сумма кредита"
            rules={[{ required: true, message: 'Введите сумму кредита!' }]}
          >
            <Input
              prefix={<DollarCircleOutlined />}
              placeholder="Введите сумму кредита"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="rate"
            label="Процентная ставка (%)"
            rules={[{ required: true, message: 'Введите процентную ставку!' }]}
          >
            <Input
              prefix={<InfoCircleOutlined />}
              placeholder="Введите процентную ставку (%)"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="term"
            label="Срок (лет)"
            rules={[{ required: true, message: 'Введите срок (лет)!' }]}
          >
            <Input
              prefix={<InfoCircleOutlined />}
              placeholder="Введите срок (лет)"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="extraPayment"
            label="Дополнительный платеж"
          >
            <Tooltip title="Добавьте сумму для досрочного погашения">
              <Input
                prefix={<DollarCircleOutlined />}
                placeholder="Введите сумму дополнительного платежа"
                type="number"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < 0) {
                    message.error('Сумма дополнительного платежа не может быть отрицательной');
                    setExtraPayment(0);
                  } else {
                    setExtraPayment(value);
                  }
                }}
              />
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CalculatorOutlined />}
              className="loan-calculator-submit"
            >
              Рассчитать
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Tooltip title="Добавить досрочное погашение">
          <Switch
            checked={earlyRepayment}
            onChange={(checked) => setEarlyRepayment(checked)}
            className="loan-calculator-switch"
          />{' '}
          Досрочное погашение
        </Tooltip>

        {result && (
          <Result
            title={`Ежемесячный платеж: ${result} руб.`}
            subTitle={`Общая переплата: ${totalOverpayment} руб.`}
          />
        )}

        {showGraph && (
          <Tabs
            defaultActiveKey="1"
            centered
            className="loan-calculator-tabs"
            items={[
              {
                label: 'График платежей',
                key: '1',
                children: <Line data={graphData} options={graphOptions} />,
              },
              {
                label: 'Остаток долга',
                key: '2',
                children: <Line data={balanceGraphData} options={graphOptions} />,
              },
            ]}
          />
        )}

        <Divider />

        <AntTitle level={4} className="loan-calculator-subtitle">
          Сохраненные кредиты
        </AntTitle>

        <List
          bordered
          dataSource={sortedLoans}
          renderItem={(loan, index) => (
            <List.Item
              actions={[
                <Button type="danger" icon={<DeleteOutlined />} onClick={() => removeLoan(index)}>
                  Удалить
                </Button>,
              ]}
              className="loan-item"
            >
              {`Кредит на сумму ${loan.amount} руб. под ${loan.rate}% на срок ${loan.term} лет - переплата: ${loan.overpayment} руб.`}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default LoanCalculator;
