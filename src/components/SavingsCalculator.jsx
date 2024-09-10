import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Slider, Row, Col, Typography, Divider, message, List } from 'antd';
import { DollarOutlined, PercentageOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Title, Text } = Typography;

const SavingsCalculator = () => {
  const [result, setResult] = useState(null);
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('savingsData');
    const savedScenarios = localStorage.getItem('scenarios');
    if (savedData) {
      const { principal, rate, years, monthlyContribution, taxRate } = JSON.parse(savedData);
      setPrincipal(principal);
      setRate(rate);
      setYears(years);
      setMonthlyContribution(monthlyContribution);
      setTaxRate(taxRate);
    }
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savingsData', JSON.stringify({ principal, rate, years, monthlyContribution, taxRate }));
    localStorage.setItem('scenarios', JSON.stringify(scenarios));

    const labels = [];
    const data = []; 
    let totalAmount = principal;

    for (let i = 1; i <= years; i++) {
      totalAmount *= (1 + rate / 100);
      totalAmount += monthlyContribution * 12;
      data.push(totalAmount.toFixed(2));
      labels.push(i);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Сумма сбережений (₽)',
          data,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4caf50',
          borderWidth: 2,
          fill: true,
        },
      ],
    });
  }, [principal, rate, years, monthlyContribution, taxRate, scenarios]);

  const saveScenario = () => {
    if (principal < 1000 || rate < 1 || years < 1) {
      message.error('Пожалуйста, введите корректные значения!');
      return;
    }

    let totalAmount = principal;

    for (let i = 1; i <= years; i++) {
      totalAmount *= (1 + rate / 100);
      totalAmount += monthlyContribution * 12;
    }

    const netResult = totalAmount * (1 - taxRate / 100);
    const newScenario = { principal, rate, years, monthlyContribution, taxRate, result: netResult.toFixed(2) };

    if (editIndex !== null) {
      const updatedScenarios = scenarios.map((scenario, index) =>
        index === editIndex ? newScenario : scenario
      );
      setScenarios(updatedScenarios);
      setEditIndex(null);
      message.success('Сценарий обновлён');
    } else {
      setScenarios([...scenarios, newScenario]);
      message.success('Сценарий сохранён');
    }
    resetCalculator();
  };

  const editScenario = (index) => {
    const scenario = scenarios[index];
    setPrincipal(scenario.principal);
    setRate(scenario.rate);
    setYears(scenario.years);
    setMonthlyContribution(scenario.monthlyContribution);
    setTaxRate(scenario.taxRate);
    setResult(scenario.result);
    setEditIndex(index);
  };

  const deleteScenario = (index) => {
    const updatedScenarios = scenarios.filter((_, i) => i !== index);
    setScenarios(updatedScenarios);
    message.success('Сценарий удалён');
  };

  const resetCalculator = () => {
    setPrincipal(10000);
    setRate(5);
    setYears(10);
    setMonthlyContribution(0);
    setTaxRate(0);
    setResult(null);
    setChartData(null);
    message.success('Данные сброшены');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card
        title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>Калькулятор Сбережений</Title>}
        bordered={false}
        style={{
          maxWidth: 800,
          margin: '0 auto',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: '#ffffff',
          padding: '24px',
        }}
      >
        <Form layout="vertical" onFinish={saveScenario}>
          <Form.Item label="Сумма сбережений">
            <Row gutter={16}>
              <Col span={18}>
                <Slider
                  min={1000}
                  max={100000}
                  step={1000}
                  value={principal}
                  onChange={(value) => setPrincipal(value)}
                  tooltip={{ open: true }}
                  trackStyle={{ backgroundColor: '#4caf50' }}
                  handleStyle={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={1000}
                  max={100000}
                  value={principal}
                  onChange={(value) => setPrincipal(value)}
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Процентная ставка (%)">
            <Row gutter={16}>
              <Col span={18}>
                <Slider
                  min={1}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(value) => setRate(value)}
                  tooltip={{ open: true }}
                  trackStyle={{ backgroundColor: '#4caf50' }}
                  handleStyle={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={1}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(value) => setRate(value)}
                  prefix={<PercentageOutlined />}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Срок (лет)">
            <Row gutter={16}>
              <Col span={18}>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(value) => setYears(value)}
                  tooltip={{ open: true }}
                  trackStyle={{ backgroundColor: '#4caf50' }}
                  handleStyle={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={1}
                  max={30}
                  value={years}
                  onChange={(value) => setYears(value)}
                  prefix={<CalendarOutlined />}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Ежемесячный взнос">
            <Row gutter={16}>
              <Col span={18}>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={monthlyContribution}
                  onChange={(value) => setMonthlyContribution(value)}
                  tooltip={{ open: true }}
                  trackStyle={{ backgroundColor: '#4caf50' }}
                  handleStyle={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={0}
                  max={5000}
                  value={monthlyContribution}
                  onChange={(value) => setMonthlyContribution(value)}
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Налоговая ставка (%)">
            <Row gutter={16}>
              <Col span={18}>
                <Slider
                  min={0}
                  max={50}
                  step={0.1}
                  value={taxRate}
                  onChange={(value) => setTaxRate(value)}
                  tooltip={{ open: true }}
                  trackStyle={{ backgroundColor: '#4caf50' }}
                  handleStyle={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}
                />
              </Col>
              <Col span={6}>
                <InputNumber
                  min={0}
                  max={50}
                  step={0.1}
                  value={taxRate}
                  onChange={(value) => setTaxRate(value)}
                  prefix={<PercentageOutlined />}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editIndex !== null ? 'Обновить сценарий' : 'Сохранить сценарий'}
            </Button>
            <Button onClick={resetCalculator}>Сбросить</Button>
          </Form.Item>
        </Form>

        {result && (
          <>
            <Divider />
            <Title level={4}>Результат</Title>
            <Text>Сумма через {years} лет: ₽{result}</Text>
            {chartData && (
              <>
                <Divider />
                <Title level={4}>График роста сбережений</Title>
                <Line data={chartData} />
              </>
            )}
          </>
        )}

        {scenarios.length > 0 && (
          <>
            <Divider />
            <Title level={4}>Сохраненные сценарии</Title>
            <List
              bordered
              dataSource={scenarios}
              renderItem={(scenario, index) => (
                <List.Item
                  actions={[
                    <Button icon={<EditOutlined />} onClick={() => editScenario(index)} />,
                    <Button icon={<DeleteOutlined />} onClick={() => deleteScenario(index)} />,
                  ]}
                >
                  <List.Item.Meta
                    title={`Сценарий ${index + 1}`}
                    description={
                      <>
                        <Text>Сумма: ₽{scenario.result}</Text>
                        <br />
                        <Text>Сумма: ₽{scenario.principal}</Text>
                        <br />
                        <Text>Процентная ставка: {scenario.rate}%</Text>
                        <br />
                        <Text>Срок: {scenario.years} лет</Text>
                        <br />
                        <Text>Ежемесячный взнос: ₽{scenario.monthlyContribution}</Text>
                        <br />
                        <Text>Налоговая ставка: {scenario.taxRate}%</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default SavingsCalculator;
