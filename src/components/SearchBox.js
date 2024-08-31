// SearchBox.js
import React from 'react';
import { Timeline, Form, Input, Button, Typography, Row, Col, Card } from 'antd';
import axios from 'axios';
import {
  MailOutlined
} from '@ant-design/icons';
const { Title, Paragraph } = Typography;


const API_KEY = '96VSGKTZFGYPDJ9H936ANDMJ2DD573X9JS';

const tokenIcons = {
  'Ethereum': 'https://api.dicebear.com/7.x/miniavs/svg?seed=ethereum',
  'USDT': 'https://api.dicebear.com/7.x/miniavs/svg?seed=usdt',
  'USDC': 'https://api.dicebear.com/7.x/miniavs/svg?seed=usdc'
};
const formatBalance = (balance, scale = 6) => {
  const num = Number(balance);
  if (num === 0) {
    return num.toFixed(2);
  } else {
    return num.toFixed(scale);
  }
};


const SearchBox = ({ setTokens, showList, setShowList, setLoading, setAddress }) => {
  const [form] = Form.useForm();

  const getAddressTokens = async (address) => {
    const ethPriceUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`;
    const ethUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;
    const usdtUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7&address=${address}&tag=latest&apikey=${API_KEY}`;
    const usdcUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&address=${address}&tag=latest&apikey=${API_KEY}`;

    try {
      const [ethPriceResponse, ethResponse, usdtResponse, usdcResponse] = await Promise.all([
        axios.get(ethPriceUrl),
        axios.get(ethUrl),
        axios.get(usdtUrl),
        axios.get(usdcUrl)
      ]);
      const ethPrice = ethPriceResponse.data.result.ethusd;
      const ethBalance = ethResponse.data.result / 1e18; // Convert wei to Ether
      const usdtBalance = usdtResponse.data.result / 1e6; // USDT has 6 decimals
      const usdcBalance = usdcResponse.data.result / 1e6; // USDC has 6 decimals
      console.log(ethPriceResponse, ethBalance, usdcBalance, usdcBalance);

      return [
        {
          name: 'Ethereum',
          price: `$${Number(ethPrice).toFixed(2)}`,
          balance: formatBalance(ethBalance, 6),
          value: `$${Number(ethPrice * ethBalance).toFixed(4)}`,
          icon: tokenIcons['Ethereum']
        },
        {
          name: 'USDT',
          price: '$1.00',
          balance: formatBalance(usdtBalance, 2),
          value: `$${formatBalance(usdtBalance, 4)}`,
          icon: tokenIcons['USDT']
        },
        {
          name: 'USDC',
          price: '$1.00',
          balance: formatBalance(usdcBalance, 2),
          value: `$${formatBalance(usdcBalance, 4)}`,
          icon: tokenIcons['USDC']
        },
      ];

    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response) {
        console.error("API Response Error:", error.response.status);
        if (error.response.status === 404) {
          console.error("404 Error: Check the URL and parameters.");
        }
      } else if (error.request) {
        console.error("API Request Error: No response received");
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    setShowList(true);
    try {
      const data = await getAddressTokens(values.address);
      if (data) {
        setTokens(data);
      } else {
        setTokens([]);
        setShowList(false);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      setTokens([]);
      setShowList(false);
    }
    setLoading(false);
    setAddress(values.address);
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="search-box-center"
        layout="inline"
      >
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: 'Not a valid Ethereum address!',
              pattern: /^0x[a-fA-F0-9]{40}$/
            },
          ]}
        >
          <Input
            placeholder="0x..."
            size='large'
            style={{ width: 450 }}
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length).length
              }
            >
              Search
            </Button>
          )}
        </Form.Item>
      </Form>
      {!showList && (
        <Row justify="center" align="top" style={{ padding: '20px', background: '#f0f2f5' }}>
          <Col span={24}>
            <Card bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
              <Typography>
                <Title level={1}>On-Chain Portfolio Manager</Title>
                <Paragraph>This project was developed to provide a comprehensive solution for managing cryptocurrencies directly on the blockchain. It allows users to view balances and perform transactions seamlessly.</Paragraph>
                <Paragraph><strong>Developed by:</strong> Dongsheng Han</Paragraph>

              </Typography>
              <div style={{ marginTop: "50px" }}>
                <Timeline pending="Waiting for response...">
                  <Timeline.Item>Day 1: Set up the environment, established the overall layout, and designed the UI for the sidebar.</Timeline.Item>
                  <Timeline.Item>Day 2: Added a search box, selected the API libraries, completed the search logic, and created a simple balance display interface.</Timeline.Item>
                  <Timeline.Item>Day 3: Further refined the balance display interface, making it a reusable component for displaying assets when connecting to a wallet.</Timeline.Item>
                  <Timeline.Item>Day 4: Fully implemented the wallet connection functionality, tested wallet switching and disconnection features, and redesigned the sidebar to support dynamic resizing without display errors.</Timeline.Item>
                  <Timeline.Item>Day 5: Redesigned the main page to ensure error-free display logic and enhanced user interface clarity.</Timeline.Item>
                </Timeline>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SearchBox;
