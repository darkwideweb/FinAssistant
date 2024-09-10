import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Form, Input, Select, DatePicker, message, Popconfirm, Row, Col, Statistic, Space, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import moment from 'moment';
import '../styles/ExpenseTracker.css';

const { Option } = Select;

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [filters, setFilters] = useState({ dateRange: [], category: null, amountRange: [0, 100000] });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    if (transactions.length) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = useCallback((values) => {
    const newKey = transactions.length ? Math.max(...transactions.map(tx => tx.key)) + 1 : 1;
    const newTransaction = { ...values, key: newKey, amount: parseFloat(values.amount), date: values.date.format('YYYY-MM-DD') };

    if (newTransaction.amount <= 0) {
      message.error('Сумма должна быть положительной!');
      return;
    }

    setTransactions(prev => [...prev, newTransaction]);
    form.resetFields();
    message.success('Транзакция добавлена!');
  }, [transactions, form]);

  const editTransaction = useCallback((key) => {
    const transaction = transactions.find(tx => tx.key === key);
    form.setFieldsValue({
      ...transaction,
      date: moment(transaction.date, 'YYYY-MM-DD'),
    });
    setEditingKey(key);
  }, [transactions, form]);

  const updateTransaction = useCallback((values) => {
    const updatedTransactions = transactions.map(tx =>
      tx.key === editingKey ? { ...values, key: editingKey, amount: parseFloat(values.amount), date: values.date.format('YYYY-MM-DD') } : tx
    );

    if (values.amount <= 0) {
      message.error('Сумма должна быть положительной!');
      return;
    }

    setTransactions(updatedTransactions);
    setEditingKey(null);
    form.resetFields();
    message.success('Транзакция обновлена!');
  }, [editingKey, transactions, form]);

  const deleteTransaction = useCallback((key) => {
    const updatedTransactions = transactions.filter(tx => tx.key !== key);
    setTransactions(updatedTransactions);

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    message.success('Транзакция удалена!');
  }, [transactions]);

  const getSummary = useCallback((type) => {
    return transactions
      .filter(tx => tx.category === type)
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const { dateRange, category, amountRange } = filters;
    return transactions.filter(tx => {
      const matchesDate = !dateRange.length || (tx.date >= dateRange[0].format('YYYY-MM-DD') && tx.date <= dateRange[1].format('YYYY-MM-DD'));
      const matchesCategory = !category || tx.category === category;
      const matchesAmount = tx.amount >= amountRange[0] && tx.amount <= amountRange[1];
      return matchesDate && matchesCategory && matchesAmount;
    });
  }, [transactions, filters]);

  const handleClearFilters = () => {
    setFilters({ dateRange: [], category: null, amountRange: [0, 100000] });
  };

  const columns = useMemo(() => [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: date => new Date(date).toLocaleDateString('ru-RU'),
    },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    { title: 'Категория', dataIndex: 'category', key: 'category' },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: amount => `${amount.toLocaleString('ru-RU')} ₽` },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" icon={<EditOutlined />} onClick={() => editTransaction(record.key)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить эту транзакцию?"
            onConfirm={() => deleteTransaction(record.key)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ], [editTransaction, deleteTransaction]);

  return (
    <motion.div className="expense-tracker-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="expense-tracker-header">
        <FilterOutlined /> Отслеживание доходов и расходов
      </h2>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Statistic title="Общий доход" value={getSummary('доход')} suffix="₽" />
        </Col>
        <Col span={12}>
          <Statistic title="Общий расход" value={getSummary('расход')} suffix="₽" />
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={editingKey ? updateTransaction : addTransaction}
        className="expense-form"
      >
        <Form.Item name="date" label="Дата" rules={[{ required: true, message: 'Выберите дату!' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание!' }]}>
          <Input placeholder="Описание" />
        </Form.Item>
        <Form.Item name="category" label="Категория" rules={[{ required: true, message: 'Выберите категорию!' }]}>
          <Select placeholder="Категория" style={{ width: '100%' }}>
            <Option value="доход">Доход</Option>
            <Option value="расход">Расход</Option>
          </Select>
        </Form.Item>
        <Form.Item name="amount" label="Сумма" rules={[{ required: true, message: 'Введите сумму!' }]}>
          <Input placeholder="Сумма" type="number" step="0.01" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className="submit-button">
            {editingKey ? 'Обновить' : 'Добавить'}
          </Button>
        </Form.Item>
      </Form>

      <div className="filters-section">
        <h4>Фильтры:</h4>
        <Row gutter={16}>
          <Col span={8}>
            <DatePicker.RangePicker
              onChange={dates => setFilters(prev => ({ ...prev, dateRange: dates }))}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Категория"
              onChange={value => setFilters(prev => ({ ...prev, category: value }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="доход">Доход</Option>
              <Option value="расход">Расход</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space.Compact>
              <Input
                style={{ width: '45%' }}
                placeholder="Мин. сумма"
                type="number"
                value={filters.amountRange[0]}
                onChange={e => setFilters(prev => ({ ...prev, amountRange: [parseFloat(e.target.value), prev.amountRange[1]] }))}
              />
              <Input
                style={{ width: '45%' }}
                placeholder="Макс. сумма"
                type="number"
                value={filters.amountRange[1]}
                onChange={e => setFilters(prev => ({ ...prev, amountRange: [prev.amountRange[0], parseFloat(e.target.value)] }))}
              />
            </Space.Compact>
          </Col>
        </Row>
        <Button type="default" icon={<ClearOutlined />} onClick={handleClearFilters} style={{ marginTop: '16px' }}>
          Сбросить фильтры
        </Button>
      </div>

      {filteredTransactions.length > 0 ? (
        <Table columns={columns} dataSource={filteredTransactions} pagination={false} />
      ) : (
        <Empty description="Нет данных для отображения" />
      )}
    </motion.div>
  );
};

export default ExpenseTracker;
