import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenList from './TokenList';
import { useWallet } from './WalletContext';
import axios from 'axios';

const API_KEY = '96VSGKTZFGYPDJ9H936ANDMJ2DD573X9JS';

const tokenAbi = [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)"
];

const Contract = {
    Ethereum: 'special-case-handle-via-provider',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
};

const getEthereumPrice = async () => {
    try {
        const response = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`);
        return response.data.result.ethusd;
    } catch (error) {
        console.error('Failed to fetch Ethereum price:', error);
        return null; // or a default fallback price
    }
};

const getTokenBalance = async (provider, walletAddress, tokenAddress) => {
    if (tokenAddress === 'special-case-handle-via-provider') {
        const balance = await provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
    } else {
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const balance = await tokenContract.balanceOf(walletAddress);
        const decimals = await tokenContract.decimals();
        return balance / Math.pow(10, decimals);
    }
};

const WalletOverview = () => {
    const { walletAddress } = useWallet();
    const [tokens, setTokens] = useState([]);
    const [balance, setBalance] = useState('0.00');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (walletAddress) {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            getEthereumPrice().then((ethPrice) => {
                console.log(ethPrice);
                Promise.all([
                    getTokenBalance(provider, walletAddress, Contract.Ethereum),
                    getTokenBalance(provider, walletAddress, Contract.USDT),
                    getTokenBalance(provider, walletAddress, Contract.USDC)
                ]).then(([ethBalance, usdtBalance, usdcBalance]) => {
                    console.log([ethBalance, usdtBalance, usdcBalance])
                    const tokenIcons = {
                        Ethereum: 'EthereumIconURL',
                        USDT: 'USDTIconURL',
                        USDC: 'USDCIconURL'
                    };
                    const tokensData = [
                        {
                            name: 'Ethereum',
                            price: `$${Number(ethPrice).toFixed(2)}`,
                            balance: Number(ethBalance).toFixed(6),
                            value: `$${(Number(ethPrice) * Number(ethBalance)).toFixed(4)}`,
                            icon: tokenIcons['Ethereum']
                        },
                        {
                            name: 'USDT',
                            price: '$1.00',
                            balance: Number(usdtBalance).toFixed(2),
                            value: `$${(Number(usdtBalance)).toFixed(4)}`,
                            icon: tokenIcons['USDT']
                        },
                        {
                            name: 'USDC',
                            price: '$1.00',
                            balance: Number(usdcBalance).toFixed(2),
                            value: `$${(Number(usdcBalance)).toFixed(4)}`,
                            icon: tokenIcons['USDC']
                        }
                    ];
                    setTokens(tokensData);
                    const totalValue = tokensData.reduce((acc, token) => acc + Number(token.value.slice(1)), 0);
                    setBalance(totalValue.toFixed(4));
                    setLoading(false);
                }).catch(error => {
                    console.error('Failed to fetch token balances:', error);
                    setLoading(false);
                });
            });
        }
    }, [walletAddress]);

    return (
        <div style={{marginTop: "50px"}}>
            {/* Wallet Info */}
            <TokenList
                tokens={tokens}
                loading={loading}
                address={walletAddress}
                totalBalance={balance}
            />
        </div>
    );
};

export default WalletOverview;
