import React from 'react';
import BudgetPlanner from '../components/BudgetPlanner';
import { Layout } from 'antd';

const { Content } = Layout;

const Budget = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '20px' }}>
        <BudgetPlanner />
      </div>
    </Content>
  </Layout>
);

export default Budget;
