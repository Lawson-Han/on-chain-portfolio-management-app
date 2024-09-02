import React from 'react';
import { Card, Typography, Input, Button, message, Divider, QRCode, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useWallet } from './WalletContext';

const { Title, Paragraph } = Typography;

const ReceiveMoney = () => {
    const { walletAddress  } = useWallet();
    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress)
            .then(() => message.success('Address copied to clipboard!'))
            .catch(err => message.error('Failed to copy address!'));
    };

    return (
        <Card bordered={false} style={{ minWidth: 400, maxWidth: 600, margin: '100px auto', padding: '20px', backgroundColor: '#ffffff' }}>
            <Title level={4}>Receive Money</Title>
            <Paragraph>
                Your Wallet Address:
            </Paragraph>
            <Input
                value={walletAddress}
                readOnly
                suffix={
                    <Button
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                        style={{ border: 'none' }}
                    />
                }
            />
            <Divider />
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <QRCode value={walletAddress || '-'} size={192} /> {/* Adjust the size here */}
            </Space>
            <Divider />
            <Paragraph type="secondary">
                Please ensure the sender is aware of the correct network (Ethereum Mainnet) and the right type of currency (ETH or ERC-20 tokens) to avoid loss of funds.
            </Paragraph>
        </Card>

    );
};

export default ReceiveMoney;
