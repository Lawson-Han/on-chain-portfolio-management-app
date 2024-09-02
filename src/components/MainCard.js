import React from 'react';
import { Card, Col, Row, Typography, Timeline, Descriptions } from 'antd';
import {
    TransactionOutlined,
    SearchOutlined,
    SettingOutlined,
    LinkOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;

const info = [
    {
        key: '1',
        label: 'Developed by',
        children: 'Dongsheng Han',
    },
    {
        key: '2',
        label: 'Email',
        children: <Link href="mailto:lawsonhan123@gmail.com">lawsonhan123@gmail.com</Link>,
    },
    {
        key: '3',
        label: 'Phone',
        children: '+852 54687392',
    },
];
const MainCard = () => {
    return (
        <Row justify="center" align="top" style={{ padding: '20px', background: '#f0f2f5' }}>
            <Col span={24}>
                <Card bordered={false} style={{ maxWidth: 800, margin: '10px auto' }}>
                    <Typography>
                        <Title level={2} style={{ marginTop: "0" }}>On-Chain Portfolio Manager</Title>
                        <Paragraph>
                            This project was developed to provide a comprehensive solution for managing cryptocurrencies directly on the blockchain.
                            It allows users to view balances and perform transactions seamlessly.
                        </Paragraph>
                        <Descriptions layout="vertical" size="small" items={info} />
                    </Typography>
                    <div style={{ marginTop: "30px" }}>
                        <Title level={3} style={{ margin: "20px 0" }}>Development Timeline</Title>
                        <Timeline pending="Waiting for HR response...">
                            <Timeline.Item dot={<SettingOutlined style={{ color: '#52c41a' }} />}>
                                Day 1: Set up the environment, established the overall layout, and designed the UI for the sidebar.
                            </Timeline.Item>
                            <Timeline.Item dot={<SearchOutlined style={{ color: '#1890ff' }} />}>
                                Day 2: Added a search box, selected the API libraries, completed the search logic, and created a simple balance display interface.
                            </Timeline.Item>
                            <Timeline.Item color='green'>
                                Day 3: Further refined the balance display interface, making it a reusable component for displaying assets when connecting to a wallet.
                            </Timeline.Item>
                            <Timeline.Item dot={<LinkOutlined style={{ color: '#722ed1' }} />}>
                                Day 4: Fully implemented the wallet connection functionality, tested wallet switching and disconnection features, and redesigned the sidebar to support dynamic resizing without display errors.
                            </Timeline.Item>
                            <Timeline.Item color='green'>
                                Day 5: Redesigned the main page to ensure error-free display logic and enhanced user interface clarity.
                            </Timeline.Item>
                            <Timeline.Item dot={<TransactionOutlined style={{ color: '#fa8c16' }} />}>
                                Day 6: Completed Wallet Send and Receive logic design and tested on Ethereum mainnet.
                            </Timeline.Item>
                            <Timeline.Item color='green'>
                                Day 7: Added localStorage to store login status and implemented WalletContext for global state management. Performed final testing.
                            </Timeline.Item>
                        </Timeline>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default MainCard;
