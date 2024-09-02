// ConnectWallet.js
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button, message, ConfigProvider } from 'antd';
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useWallet } from './WalletContext';

const ConnectWallet = ({ collapsed }) => {
    const { walletAddress, updateWallet, clearWallet } = useWallet();
    const [loading, setLoading] = useState(false);

    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const rootPrefixCls = getPrefixCls();

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                console.log("Please connect to MetaMask.");
                clearWallet();
            } else if (accounts[0] !== walletAddress) {
                updateWallet(accounts[0]);
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
    }, [walletAddress, updateWallet, clearWallet]);

    const connectWalletHandler = async () => {
        if (!window.ethereum) {
            message.error("MetaMask is not installed. Please install it to use this feature.");
            return;
        }
        setLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length <= 0) {
                await provider.send("eth_requestAccounts", []);
            }
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            updateWallet(address);
        } catch (error) {
            console.error("Failed to connect to MetaMask:", error);
            message.error("Failed to connect to MetaMask.");
        }
        setLoading(false);
    };

    const disconnectWalletHandler = async () => {
        setLoading(true);
        try {
            await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
            console.log("Permissions revoked successfully.");
            clearWallet();
        } catch (error) {
            console.error("Failed to revoke permissions:", error);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const linearGradientButton = css`
        &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
          border-width: 0;
          > span {
            position:relative;
          }
          &::before {
            content: '';
            background: linear-gradient(135deg, #6253e1, #04befe);
            position:absolute;
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
            {walletAddress ? (
                <Button type="dashed" danger icon={<DisconnectOutlined />} onClick={disconnectWalletHandler} loading={loading}>
                    {!collapsed && "Disconnect Metamask"}
                </Button>
            ) : (
                <Button type={!collapsed ? "primary" : "text"} icon={<WalletOutlined />} className={!collapsed && linearGradientButton} onClick={connectWalletHandler} loading={loading}>
                    {!collapsed && "Login Wallet"}
                </Button>
            )}
        </>
    );
};

export default ConnectWallet;
