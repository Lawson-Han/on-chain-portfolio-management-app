import React from 'react';
import TokenCard from './TokenCard';
import { Skeleton, Statistic, Row, Col } from 'antd';

const TokenList = ({ tokens, loading, address, totalBalance }) => {
  return (
    <div className="token-list-container">
      {/* User Address and Balance */}
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={24}>
          <Statistic loading={loading} title="Wallet Address" value={address} />
        </Col>
      </Row>

      {/* ENS Name and Total Balance */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Statistic title="Total Balance" loading={loading} value={`$${totalBalance}`} precision={6} />
        </Col>
        <Col span={12}>
          <Statistic title="Chain" loading={loading} value="Ethereum" />
        </Col>

      </Row>


      {/* Table Head */}
      <div className="token-table-head">
        <div className="token-head-cell">Asset</div>
        <div className="token-head-cell">Price</div>
        <div className="token-head-cell">Balance</div>
        <div className="token-head-cell">Value</div>
      </div>

      {/* Loading ~ Skelton*/}
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        tokens.map(token => <TokenCard key={token.name} token={token} />)
      )}
    </div>
  );
};

export default TokenList;
