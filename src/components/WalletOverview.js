import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenList from './TokenList';
import { useWallet } from './WalletContext';

const tokenAbi = [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)"
];

const Contract = {
    Ethereum: 'special-case-handle-via-provider',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
};

const getBalance = async (walletAddress) => {
    try {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        return balance
    } catch (error) {
        console.error('Failed to fetch balance:', error);
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
    const [balance, setBalance] = useState('0.00');
    const [loading, setLoading] = useState(false);
    const [tokens, updateTokens] = useState([]);

    const { walletAddress } = useWallet();

    const fetchAndSetTokens = async (walletAddress, updateTokens, setLoading) => {
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const [ethBalance, usdtBalance, usdcBalance] = await Promise.all([
                getTokenBalance(provider, walletAddress, Contract.Ethereum),
                getTokenBalance(provider, walletAddress, Contract.USDT),
                getTokenBalance(provider, walletAddress, Contract.USDC)
            ]);

            const ethPrice = 1500; // Example price, fetch from an API for real applications
            const tokenIcons = {
                Ethereum: 'EthereumIconURL',
                USDT: 'USDTIconURL',
                USDC: 'USDCIconURL'
            };

            const tokensData = [
                {
                    name: 'Ethereum',
                    price: `$${ethPrice.toFixed(2)}`,
                    balance: Number(ethBalance).toFixed(6),
                    value: `$${(ethPrice * Number(ethBalance)).toFixed(4)}`,
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
                },
            ];

            updateTokens(tokensData);
            // Calculate total balance
            const totalValue = tokensData.reduce((acc, token) => acc + Number(token.value.slice(1)), 0);
            setBalance(totalValue.toFixed(4));
        } catch (error) {
            console.error('Failed to fetch token balances:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            getBalance(walletAddress, setBalance, setLoading);
            fetchAndSetTokens(walletAddress, updateTokens, setLoading);
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
