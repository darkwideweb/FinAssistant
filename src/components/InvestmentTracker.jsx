import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Card, Typography, Space, Modal, Popconfirm, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, ImportOutlined, LineChartOutlined, FundOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import '../styles/InvestmentTracker.css';

const { Option } = Select;
const { Title } = Typography;

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState([]);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const addInvestment = (values) => {
    setInvestments(prev => [...prev, { ...values, key: prev.length + 1 }]);
    form.resetFields();
    message.success('Инвестиция добавлена!');
  };

  const editInvestment = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
  };

  const updateInvestment = (values) => {
    setInvestments(prev => prev.map(inv => inv.key === editing.key ? { ...values, key: inv.key } : inv));
    setEditing(null);
    form.resetFields();
    message.success('Инвестиция обновлена!');
  };

  const deleteInvestment = (key) => {
    setInvestments(prev => prev.filter(inv => inv.key !== key));
    message.success('Инвестиция удалена!');
  };

  const exportData = () => {
    if (investments.length === 0) {
      message.warning('Нет данных для экспорта!');
      return;
    }
    const csv = Papa.unparse(investments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'investments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Данные экспортированы!');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data.slice(1).map((row, index) => ({
            key: index + 1,
            asset: row[0],
            type: row[1],
            amount: parseFloat(row[2]),
            price: parseFloat(row[3]),
          }));
          if (data.length > 0) {
            setInvestments(data);
            message.success('Данные успешно импортированы!');
          } else {
            message.error('Ошибка при импорте данных.');
          }
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  const columns = [
    { 
      title: 'Актив', 
      dataIndex: 'asset', 
      key: 'asset', 
      sorter: (a, b) => a.asset.localeCompare(b.asset), 
      render: (text) => <strong>{text}</strong> 
    },
    { 
      title: 'Тип', 
      dataIndex: 'type', 
      key: 'type', 
      filters: [{ text: 'Акция', value: 'акция' }, { text: 'Криптовалюта', value: 'криптовалюта' }], 
      onFilter: (value, record) => record.type === value 
    },
    { 
      title: 'Количество', 
      dataIndex: 'amount', 
      key: 'amount', 
      sorter: (a, b) => a.amount - b.amount 
    },
    { 
      title: 'Цена', 
      dataIndex: 'price', 
      key: 'price', 
      sorter: (a, b) => a.price - b.price 
    },
    { 
      title: 'Итоговая стоимость', 
      dataIndex: 'total', 
      key: 'total', 
      render: (_, record) => (record.amount * record.price).toFixed(2) + ' ₽' 
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Редактировать">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => editInvestment(record)} 
              style={{ borderColor: '#1890ff', color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm title="Вы уверены, что хотите удалить эту запись?" onConfirm={() => deleteInvestment(record.key)}>
            <Tooltip title="Удалить">
              <Button 
                icon={<DeleteOutlined />} 
                style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const graphData = {
    labels: investments.map(inv => inv.asset),
    datasets: [
      {
        label: 'Инвестиции',
        data: investments.map(inv => inv.amount * inv.price),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const investmentPlatforms = [
    { name: 'Тинькофф Инвестиции', url: 'https://www.tinkoff.ru/invest/', icon: <FundOutlined /> },
    { name: 'Сбербанк Инвестор', url: 'https://www.sberbank.ru/ru/person/investments', icon: <FundOutlined /> },
    { name: 'Альфа Групп', url: 'https://alfabank.ru/investments/', icon: <FundOutlined /> },
    { name: 'Финам', url: 'https://www.finam.ru/', icon: <FundOutlined /> },
    { name: 'БКС', url: 'https://www.bcs.ru/', icon: <FundOutlined /> },
  ];

  return (
    <Card className="investment-container" hoverable>
      <Title level={3} className="investment-header">Инвестиционный трекер</Title>
      <Form form={form} layout="vertical" onFinish={editing ? updateInvestment : addInvestment} className="investment-content">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item name="asset" label="Актив" rules={[{ required: true, message: 'Введите актив!' }]}>
            <Input placeholder="Актив" />
          </Form.Item>
          <Form.Item name="type" label="Тип" rules={[{ required: true, message: 'Выберите тип!' }]}>
            <Select placeholder="Тип актива">
              <Option value="акция">Акция</Option>
              <Option value="криптовалюта">Криптовалюта</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Количество" rules={[{ required: true, message: 'Введите количество!' }]}>
            <Input placeholder="Количество" type="number" />
          </Form.Item>
          <Form.Item name="price" label="Цена" rules={[{ required: true, message: 'Введите цену!' }]}>
            <Input placeholder="Цена" type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              {editing ? 'Обновить' : 'Добавить'}
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <Table 
        dataSource={investments} 
        columns={columns} 
        pagination={false} 
        className="investment-table"
        footer={() => (
          <div>
            <strong>Общая стоимость:</strong> {investments.reduce((acc, inv) => acc + inv.amount * inv.price, 0).toFixed(2)} ₽
          </div>
        )}
      />

      <Space style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="default"
          icon={<ExportOutlined />}
          onClick={exportData}
        >
          Экспорт данных
        </Button>
        <input type="file" accept=".csv" onChange={importData} style={{ display: 'none' }} id="import-input" />
        <Button type="default" icon={<ImportOutlined />} onClick={() => document.getElementById('import-input').click()}>
          Импорт данных
        </Button>
        <Button 
          type="default" 
          icon={<LineChartOutlined />} 
          onClick={() => setShowGraph(!showGraph)}
        >
          Показать график
        </Button>
      </Space>

      <Modal
        title="График Инвестиций"
        open={showGraph}
        onCancel={() => setShowGraph(false)}
        footer={null}
        className="investment-graph-modal"
      >
        <Line data={graphData} />
      </Modal>

      <Card title="Платформы для Инвестирования" className="investment-platforms-card">
        {investmentPlatforms.map((platform) => (
          <Tooltip key={platform.name} title={platform.name}>
            <Button 
              type="link" 
              href={platform.url} 
              target="_blank" 
              icon={platform.icon} 
              className="investment-platform-button"
            >
              {platform.name}
            </Button>
          </Tooltip>
        ))}
      </Card>
    </Card>
  );
};

export default InvestmentTracker;
