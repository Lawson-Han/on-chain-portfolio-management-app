// App.js
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button, Space } from 'antd';
import { UserOutlined, GithubOutlined, WalletOutlined } from '@ant-design/icons';
import './App.css';
import SearchBox from './components/SearchBox';
import TokenList from './components/TokenList';

const { Sider, Content } = Layout;

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  // Calculate total balance
  const handleSetTokens = (newTokens) => {
    setTokens(newTokens);
    const total = newTokens.reduce((acc, token) => acc + parseFloat(token.value.replace('$', '')), 0);
    setTotalBalance(total);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} style={{ backgroundColor: 'white', boxShadow: '2px 0 6px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Avatar size={96} icon={<UserOutlined />} />
          <Space direction="vertical" style={{ width: '100%', margin: '20px 0' }}>
            <Button type="primary" icon={<WalletOutlined />}>Login Wallet</Button>
          </Space>
        </div>
        <Menu mode="inline" style={{ borderRight: 0 }}>
          <Menu.Item key="1">My Wallet</Menu.Item>
          <Menu.Item key="2">Send & Receive</Menu.Item>
        </Menu>
        <div style={{ padding: '16px', textAlign: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
          <Button type="link" icon={<GithubOutlined />} href="https://github.com/Lawson-Han" target="_blank">Visit my GitHub</Button>
        </div>
      </Sider>
      <Content style={{ padding: '16px', width: '600px' }}>
        <div className="search-box-center">
          <SearchBox
            setTokens={handleSetTokens}
            setShowList={setShowList}
            setLoading={setLoading}
            setAddress={setAddress}
          />
        </div>
        {showList &&
          <TokenList
            tokens={tokens}
            loading={loading}
            address={address}
            totalBalance={totalBalance}
          />}

      </Content>
    </Layout>
  );
};

export default App;
