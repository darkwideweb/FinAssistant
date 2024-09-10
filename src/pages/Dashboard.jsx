import React from 'react';
import { Row, Col, Card, Button, Statistic } from 'antd';
import { WalletOutlined, SafetyCertificateOutlined, StockOutlined, FundOutlined, DollarOutlined, GlobalOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const animations = {
  card: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, type: 'spring', stiffness: 300 },
    hover: { scale: 1.05, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)' }
  }
};

const financialData = [
  {
    title: 'Транзакции',
    icon: <WalletOutlined style={{ color: '#1890ff' }} />,
    value: 12000,
    link: '/transactions',
    description: 'Легкость и контроль в управлении вашими транзакциями.'
  },
  {
    title: 'Сбережения',
    icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />,
    value: 5000,
    link: '/savings',
    description: 'Умный способ накопления и планирования сбережений.'
  },
  {
    title: 'Инвестиции',
    icon: <StockOutlined style={{ color: '#fa541c' }} />,
    value: 15000,
    link: '/investments',
    description: 'Инвестируйте с уверенностью и аналитикой.'
  },
  {
    title: 'Бюджет',
    icon: <FundOutlined style={{ color: '#13c2c2' }} />,
    value: 20000,
    link: '/budget',
    description: 'Сбалансируйте свои расходы и доходы.'
  },
  {
    title: 'Кредиты',
    icon: <DollarOutlined style={{ color: '#eb2f96' }} />,
    value: 8000,
    link: '/loans',
    description: 'Следите за своими долгами и погашайте их вовремя.'
  },
  {
    title: 'Обмен валют',
    icon: <GlobalOutlined style={{ color: '#722ed1' }} />,
    value: 75.45,
    link: '/currency',
    description: 'Обменяйте валюту на лучших условиях.'
  }
];

const Dashboard = () => (
  <div className="dashboard-container">
    <div className="greeting-container">
      <h1 className="dashboard-title">Личный Финансовый Ассистент</h1>
      <p className="greeting-description">
        Управляйте своими финансами уверенно. Ваши транзакции, сбережения и инвестиции всегда под контролем.
      </p>
    </div>
    <Row gutter={32}>
      {financialData.slice(0, 3).map((item, index) => (
        <Col span={8} key={index}>
          <motion.div
            initial={animations.card.initial}
            animate={animations.card.animate}
            transition={animations.card.transition}
            whileHover={animations.card.hover}
          >
            <Card
              className="card"
              title={<span>{item.icon} {item.title}</span>}
              bordered={false}
              extra={<Button type="link"><Link to={item.link}>Посмотреть</Link></Button>}
            >
              <Statistic title={`Общий ${item.title.toLowerCase()}`} value={item.value} prefix="₽" className="card-content" />
              <p className="card-description">{item.description}</p>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
    <Row gutter={32} style={{ marginTop: '24px' }}>
      {financialData.slice(3).map((item, index) => (
        <Col span={8} key={index}>
          <motion.div
            initial={animations.card.initial}
            animate={animations.card.animate}
            transition={animations.card.transition}
            whileHover={animations.card.hover}
          >
            <Card
              className="card"
              title={<span>{item.icon} {item.title}</span>}
              bordered={false}
              extra={<Button type="link"><Link to={item.link}>Посмотреть</Link></Button>}
            >
              <Statistic title={`Общий ${item.title.toLowerCase()}`} value={item.value} prefix="₽" className="card-content" />
              <p className="card-description">{item.description}</p>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  </div>
);

export default Dashboard;
