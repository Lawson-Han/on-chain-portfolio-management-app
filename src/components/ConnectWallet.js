import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button, message, ConfigProvider } from 'antd';
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';

const ConnectWallet = ({ setWalletAddress }) => {
    const [localAddress, setLocalAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const rootPrefixCls = getPrefixCls();

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has disconnected all accounts
                console.log("Please connect to MetaMask.");
                setLocalAddress(null);
                setWalletAddress(null);
            } else if (accounts[0] !== localAddress) {
                // Handle accounts change
                setLocalAddress(accounts[0]);
                setWalletAddress(accounts[0]);
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [localAddress, setWalletAddress]);

    const connectWalletHandler = async () => {
        if (!window.ethereum) {
            message.error("MetaMask is not installed. Please install it to use this feature.");
            return;
        }
        setLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();  // Get current account list

            // Check if there are any accounts already connected
            if (accounts.length <= 0) {
                // If no accounts are connected, request to connect an account
                await provider.send("eth_requestAccounts", []);
            }
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setLocalAddress(address);
            setWalletAddress(address);
            message.success("Metamask Wallet connected!");



        } catch (error) {
            console.error("Failed to connect to MetaMask:", error);
            message.error("Failed to connect to MetaMask. Please try again.");
        }
        setLoading(false);
    };


    const disconnectWalletHandler = () => {
        setLoading(true);
        setTimeout(() => {
            setLocalAddress(null);
            setWalletAddress(null);
            setLoading(false);
            message.info("Wallet disconnected.");
        }, 500);
    };

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
        <>
            {localAddress !== null ? (
                <Button type="dashed" danger icon={<DisconnectOutlined />} onClick={disconnectWalletHandler} loading={loading}>
                    Disconnect Metamask
                </Button>
            ) : (
                <Button type="primary" icon={<WalletOutlined />} className={linearGradientButton} onClick={connectWalletHandler} loading={loading}>
                    Login Wallet
                </Button>
            )}
        </>
    );
};

export default ConnectWallet;
