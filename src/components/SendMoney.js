import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Radio, message, Card, Typography } from 'antd';
import { WalletOutlined, DollarCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
const { Title } = Typography;

const getBalance = async (currency, walletAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenAddress = {
        'ETH': null,
        'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    };

    if (currency === 'ETH') {
        const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    } else if (tokenAddress[currency]) {
        const tokenContract = new ethers.Contract(tokenAddress[currency], [
            'function balanceOf(address) view returns (uint256)'
        ], provider);

        const currentBalance = await tokenContract.balanceOf(walletAddress);
        return ethers.utils.formatUnits(currentBalance, 6);
    } else {
        throw new Error('Unsupported currency');
    }
};

const SendMoney = ({ walletAddress }) => {
    const [form] = Form.useForm();
    const [maxAmount, setMaxAmount] = useState(null);
    const [currencyUnit, setCurrencyUnit] = useState('ETH');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load default currency balance on component mount
        (async () => {
            const defaultCurrency = 'ETH';
            const balance = await getBalance(defaultCurrency, walletAddress);
            setMaxAmount(balance);
        })();
    }, [walletAddress]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const transaction = await signer.sendTransaction({
                to: values.toAddress,
                value: ethers.utils.parseEther(values.amount.toString()) // Convert the ETH to Wei
            });
            await transaction.wait();
            message.success('Transaction submitted successfully!');
        } catch (error) {
            console.error('Transaction failed:', error);
            message.error('Transaction failed!');
        }
        setLoading(false);
        const balance = await getBalance(values.currency, walletAddress);
        setMaxAmount(balance);
    };

    const onFinishFailed = (errorInfo) => {
        setLoading(false);
        console.log('Failed:', errorInfo);
        message.error('Failed to submit transaction!');
    };

    const handleCurrencyChange = async (e) => {
        const currency = e.target.value;
        setCurrencyUnit(currency);
        setMaxAmount(0);
        const balance = await getBalance(currency, walletAddress);
        setMaxAmount(balance);
        form.setFieldsValue({ amount: '' });
    };

    const handleMaxAmount = () => {
        form.setFieldsValue({ amount: maxAmount });
    };

    return (
        <Card bordered={false} style={{ minWidth: 400, maxWidth: 600, margin: '100px auto', padding: '20px', backgroundColor: '#ffffff' }}>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Title level={4}>Send Money</Title>
                <Form.Item
                    name="toAddress"
                    label="To Address"
                    rules={[{ required: true, message: 'Not a valid Ethereum address!', pattern: /^0x[a-fA-F0-9]{40}$/ }]}
                >
                    <Input prefix={<WalletOutlined />} placeholder="0x..." style={{ width: "420px" }} />
                </Form.Item>
                <Form.Item
                    name="currency"
                    label="Currency"
                >
                    <Radio.Group onChange={handleCurrencyChange} defaultValue="ETH">
                        <Radio.Button value="ETH">ETH</Radio.Button>
                        <Radio.Button value="USDC">USDC</Radio.Button>
                        <Radio.Button value="USDT">USDT</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[{ required: true, message: 'Please input the amount to send!' }]}
                    extra={`Available balance: ${loading ? '0' : parseFloat(maxAmount).toFixed(6)} ${currencyUnit}`}>
                    <InputNumber
                        prefix={<DollarCircleOutlined />}
                        min={0.00}
                        max={maxAmount}
                        controls={false}
                        addonAfter={(maxAmount && maxAmount > 0) && <Button size="small" type="link" icon={<ArrowUpOutlined />} onClick={handleMaxAmount}>Max</Button>}
                        suffix={currencyUnit}
                        placeholder="Amount"
                        step="0.01"
                        style={{ minWidth: "60%" }}
                        type='number'
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" block style={{ maxWidth: "100px" }} loading={loading}>
                    Send
                </Button>

            </Form>
        </Card>
    );
};

export default SendMoney;
