import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, List, message, Modal, Progress, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import '../styles/BudgetPlanner.css';

const { Option } = Select;

const BudgetPlanner = () => {
  const [budgets, setBudgets] = useState([]);
  const [form] = Form.useForm();
  const [editBudget, setEditBudget] = useState(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [currency, setCurrency] = useState('RUB');

  const calculateTotals = useCallback((budgets) => {
    const totalBudget = budgets.reduce((acc, cur) => acc + parseFloat(cur.limit), 0);
    const totalSpent = budgets.reduce((acc, cur) => acc + parseFloat(cur.spent || 0), 0);
    setTotalBudget(totalBudget);
    setSpent(totalSpent);
  }, []);

  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
    setBudgets(savedBudgets);
    calculateTotals(savedBudgets);
  }, [calculateTotals]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    calculateTotals(budgets);
  }, [budgets, calculateTotals]);

  const addBudget = (values) => {
    const limit = parseFloat(values.limit);
    if (isNaN(limit) || limit <= 0) {
      message.error('Лимит должен быть положительным числом!');
      return;
    }
    if (budgets.some(b => b.category === values.category)) {
      message.error('Категория уже существует!');
      return;
    }
    const newBudget = { ...values, limit, key: uuidv4(), spent: 0 };
    setBudgets([...budgets, newBudget]);
    form.resetFields();
    message.success('Бюджет успешно добавлен!');
  };

  const deleteBudget = (key) => {
    Modal.confirm({
      title: 'Удалить бюджет?',
      content: 'Вы уверены, что хотите удалить этот бюджет?',
      onOk: () => {
        const updatedBudgets = budgets.filter(b => b.key !== key);
        setBudgets(updatedBudgets);
        message.success('Бюджет успешно удален!');
      }
    });
  };

  const editExistingBudget = (key, values) => {
    const limit = parseFloat(values.limit);
    if (isNaN(limit) || limit <= 0) {
      message.error('Лимит должен быть положительным числом!');
      return;
    }
    const updatedBudgets = budgets.map(b => b.key === key ? { ...b, ...values, limit } : b);
    setBudgets(updatedBudgets);
    setEditBudget(null);
    form.resetFields();
    message.success('Изменения успешно сохранены!');
  };

  const updateSpent = (key, amount) => {
    if (isNaN(amount) || amount <= 0) {
      message.error('Введите корректную сумму!');
      return;
    }
    const updatedBudgets = budgets.map(b => b.key === key ? { ...b, spent: b.spent + amount } : b);
    setBudgets(updatedBudgets);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    // Реализуйте логику для пересчета валюты
  };

  return (
    <motion.div className="planner-container">
      <h2 className="planner-header">Планировщик бюджета</h2>
      <Card className="planner-card">
        <Form
          form={form}
          layout="inline"
          onFinish={editBudget ? (values) => editExistingBudget(editBudget.key, values) : addBudget}
        >
          <Form.Item name="category" rules={[{ required: true, message: 'Введите категорию!' }]}>
            <Input placeholder="Категория" className="input-field" />
          </Form.Item>
          <Form.Item
            name="limit"
            rules={[
              { required: true, message: 'Введите лимит!' },
              { validator: (_, value) => {
                  const limit = parseFloat(value);
                  if (isNaN(limit) || limit <= 0) {
                    return Promise.reject('Лимит должен быть положительным числом!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input placeholder={`Лимит (${currency})`} type="number" className="input-field" />
          </Form.Item>
          <Form.Item>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" htmlType="submit" className="submit-button">
                {editBudget ? 'Сохранить изменения' : 'Добавить'} <PlusOutlined />
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
      </Card>

      <Select value={currency} onChange={handleCurrencyChange} className="currency-selector">
        <Option value="RUB">RUB</Option>
        <Option value="USD">USD</Option>
        <Option value="EUR">EUR</Option>
      </Select>

      <div className="budget-list-container">
        <h3 className="sub-header">Текущие бюджеты:</h3>
        <List
          dataSource={budgets}
          renderItem={budget => (
            <motion.div key={budget.key} className="budget-item">
              <List.Item
                actions={[
                  <Button icon={<EditOutlined />} onClick={() => setEditBudget(budget)} className="edit-button" />,
                  <Button icon={<DeleteOutlined />} onClick={() => deleteBudget(budget.key)} className="delete-button" />,
                  <Button
                    onClick={() => {
                      const amount = parseFloat(prompt('Введите сумму для добавления:'));
                      if (!isNaN(amount) && amount > 0) {
                        updateSpent(budget.key, amount);
                        message.success(`Добавлено ${amount} ${currency} к категории ${budget.category}`);
                      } else {
                        message.error('Введите корректную сумму!');
                      }
                    }}
                    className="add-expense-button"
                  >
                    Добавить расход
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<DollarCircleOutlined className="budget-icon" />}
                  title={<span className="budget-title">{budget.category}</span>}
                  description={`Лимит: ${budget.limit} ${currency} | Потрачено: ${budget.spent} ${currency}`}
                />
                <Progress percent={(budget.spent / budget.limit) * 100} strokeColor={(budget.spent / budget.limit) > 0.75 ? '#ff4d4f' : '#1890ff'} />
              </List.Item>
            </motion.div>
          )}
        />
      </div>

      <div className="summary">
        <h3>Общий лимит бюджета: {totalBudget} {currency}</h3>
        <h3>Всего потрачено: {spent} {currency}</h3>
      </div>
    </motion.div>
  );
};

export default BudgetPlanner;
