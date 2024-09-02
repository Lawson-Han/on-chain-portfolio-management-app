// App.js
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button, Space, Typography, message, } from 'antd';
import {
  SearchOutlined,
  TransactionOutlined,
  UserOutlined,
  GithubOutlined,
  PieChartOutlined,
  MoneyCollectOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons';
import './App.css';
import SearchBox from './components/SearchBox';
import TokenList from './components/TokenList';
import ConnectWallet from './components/ConnectWallet';
import WalletOverview from './components/WalletOverview';
import SendMoney from './components/SendMoney';
import ReceiveMoney from './components/ReceiveMoney';
import { useWallet } from './components/WalletContext';
const { Sider, Content } = Layout;
const { Paragraph } = Typography;


const App = () => {
  const [activeComponent, setActiveComponent] = useState('search');
  const { walletAddress } = useWallet();

  // Side Bar
  const items = [
    {
      key: '1',
      icon: <SearchOutlined />,
      label: 'Home',
      onClick: () => setActiveComponent('search')
    },
    {
      key: '2',
      icon: <PieChartOutlined />,
      label: 'My Portfolio',
      onClick: () => {
        if (!walletAddress) {
          message.info('You need to login with your wallet first');
        } else {
          setActiveComponent('portfolio');
        }
      }
    },
    {
      key: '3',
      icon: <TransactionOutlined />,
      label: 'Transaction',
      children: [
        {
          key: '3-1',
          icon: <VerticalAlignTopOutlined />,
          label: 'Send',
          onClick: () => {
            if (!walletAddress) {
              message.info('You need to login with your wallet first');
            } else {
              setActiveComponent('send');
            }
          }
        },
        {
          key: '3-2',
          icon: <MoneyCollectOutlined />,
          label: 'Receive',
          onClick: () => {
            if (!walletAddress) {
              message.info('You need to login with your wallet first');
            } else {
              setActiveComponent('receive');
            }
          },
        }
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState(false);

  // Search Bar
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
  // Address ellipse customised
  const formatAddress = (address) => {
    if (!address || collapsed) return '';
    const start = address.slice(0, 8);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'search':
        return (<> <SearchBox
          setTokens={handleSetTokens}
          setShowList={setShowList}
          setLoading={setLoading}
          setAddress={setAddress}
          showList={showList}
        />
          {
            showList &&
            <TokenList
              tokens={tokens}
              loading={loading}
              address={address}
              totalBalance={totalBalance}
            />
          }</>);
      case 'portfolio':
        return <WalletOverview />;
      case 'send':
        return <SendMoney />;
      case 'receive':
        return <ReceiveMoney />;
      default:
        return null;
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        style={{ backgroundColor: 'white', boxShadow: '2px 0 6px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Avatar size={collapsed ? 48 : 96} icon={<UserOutlined />} />
          <Space direction="vertical" size={0} style={{ width: '100%', margin: '20px 0 10px 0' }}>
            {walletAddress !== null && (
              <Paragraph className="wallet-address" copyable={!collapsed && { text: walletAddress }}>
                {formatAddress(walletAddress)}
              </Paragraph>
            )}
            <ConnectWallet collapsed={collapsed} />
          </Space>
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['3']}
          mode="inline"
          items={items}
        />
        <div style={{ padding: '16px', textAlign: 'center', position: 'relative', margin: "20px 0", width: '100%' }}>
          {collapsed ?
            <Button type="link" icon={<GithubOutlined />} href="https://github.com/Lawson-Han" target="_blank"></Button>
            :
            <Button type="link" icon={<GithubOutlined />} href="https://github.com/Lawson-Han" target="_blank">Visit my GitHub</Button>
          }
        </div>
      </Sider >
      <Content style={{ width: '600px', margin: '0 auto' }}>
        {renderComponent()}
      </Content>
    </Layout>
  );
};

export default App;