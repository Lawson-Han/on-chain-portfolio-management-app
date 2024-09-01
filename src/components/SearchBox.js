// SearchBox.js
import React from 'react';
import { Form, Input, Button } from 'antd';
import MainCard from './MainCard';
import axios from 'axios';


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
            placeholder="Enter any Ethereum wallet address..."
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
      {!showList && <MainCard />}
    </>
  );
};

export default SearchBox;
