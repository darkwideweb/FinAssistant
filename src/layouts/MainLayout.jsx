import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, TransactionOutlined, FundProjectionScreenOutlined, CreditCardOutlined, GlobalOutlined, DashboardOutlined, WalletOutlined } from '@ant-design/icons';
import { FaTelegramPlane, FaGithub } from 'react-icons/fa';
import '../styles/MainLayout.css';
import { motion } from 'framer-motion';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [dateTime, setDateTime] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem('selectedKey') || '1';
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = useCallback((e) => {
    setSelectedKey(e.key);
    localStorage.setItem('selectedKey', e.key);
  }, []);

  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: <Link to="/">Главная</Link> },
    { key: '2', icon: <TransactionOutlined />, label: <Link to="/transactions">Транзакции</Link> },
    { key: '3', icon: <WalletOutlined />, label: <Link to="/savings">Сбережения</Link> },
    { key: '4', icon: <FundProjectionScreenOutlined />, label: <Link to="/investments">Инвестиции</Link> },
    { key: '5', icon: <DashboardOutlined />, label: <Link to="/budget">Бюджет</Link> },
    { key: '6', icon: <CreditCardOutlined />, label: <Link to="/loans">Кредиты</Link> },
    { key: '7', icon: <GlobalOutlined />, label: <Link to="/currency">Обмен валют</Link> },
  ];

  const renderIconWithMotion = (link, IconComponent, size = 24) => (
    <motion.div whileHover={{ scale: 1.2 }}>
      <a href={link} target="_blank" rel="noopener noreferrer" className="icon-link">
        <IconComponent size={size} />
      </a>
    </motion.div>
  );

  return (
    <Layout className="layout">
      <Header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="logo"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Title level={3} className="logo-text">FinAssistant</Title>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems}
            className="menu"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          />
        </motion.div>
      </Header>
      <Content className="content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="site-layout-content"
        >
          {children}
        </motion.div>
      </Content>
      <Footer className="footer">
        <div className="footer-quiz-button-container">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button type="primary" className="footer-quiz-button">
              <Link to="/quiz">Пройти квиз</Link>
            </Button>
          </motion.div>
        </div>
        <p className="footer-text">Личный Финансовый Ассистент ©2024</p>
        <p className="footer-text">{dateTime.toLocaleString()}</p>
        <div className="footer-icons">
          {renderIconWithMotion("https://t.me/darkwidewebs", FaTelegramPlane)}
          {renderIconWithMotion("https://github.com/darkwideweb", FaGithub)}
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
