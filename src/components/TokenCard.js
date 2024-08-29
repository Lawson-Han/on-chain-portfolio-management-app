// TokenCard.js
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const TokenCard = ({ token }) => {
  return (
    <div className="token-card">
      <div className="token-section">
        <Text strong style={{ fontSize: '18px' }}>{token.name}</Text>
      </div>
      <div className="token-section">
        <Text style={{ fontSize: '16px' }}>{`${token.price}`}</Text>
      </div>
      <div className="token-section">
        <Text style={{ fontSize: '16px'}}>{`${token.balance}`}</Text>
      </div>
      <div className="token-section">
        <Text style={{ fontSize: '16px' }}>{`${token.value}`}</Text>
      </div>
    </div>
  );
};

export default TokenCard;

