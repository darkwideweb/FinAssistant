import React from 'react';
import InvestmentTracker from '../components/InvestmentTracker';
import { Typography, Layout } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const Investments = () => (
  <Layout style={{ minHeight: '100vh', background: '#f0f2f5', padding: '40px' }}>
    <Content style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
        Инвестиции
      </Title>
      <InvestmentTracker />
    </Content>
  </Layout>
);

export default Investments;
