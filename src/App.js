import React, { useContext } from 'react';
import { Layout, Menu, Avatar, Button, ConfigProvider, Space } from 'antd';
import { UserOutlined, GithubOutlined, WalletOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import './App.css';
import SearchBox from './components/SearchBox';

const { Sider } = Layout;

const App = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();

  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <ConfigProvider
        button={{
          className: linearGradientButton,
        }}
      >
        <Sider width={300} style={{ backgroundColor: 'white', boxShadow: '2px 0 6px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Avatar size={96} icon={<UserOutlined />} />
            <Space direction="vertical" style={{ width: '100%', margin: '20px 0' }}>
              <Button type="primary" icon={<WalletOutlined />} >
                Login Wallet
              </Button>
            </Space>
          </div>
          <Menu mode="inline" style={{ borderRight: 0 }}>
            <Menu.Item key="1">
              My Wallet
            </Menu.Item>
            <Menu.Item key="2">
              Send & Receive
            </Menu.Item>
          </Menu>
          <div style={{ padding: '16px', textAlign: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
            <Button type="link" icon={<GithubOutlined />} href="https://github.com/yourUsername" target="_blank">
              Visit my GitHub
            </Button>
          </div>
        </Sider>
      </ConfigProvider>
      <Layout>
        <div className="main-page-center">
          <SearchBox />
        </div>
      </Layout>
    </Layout>
  );
};

export default App;
