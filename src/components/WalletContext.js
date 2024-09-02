// WalletContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(() => {
        return localStorage.getItem('walletAddress');
    });

    // Update localStorage when walletAddress changes
    useEffect(() => {
        if (walletAddress) {
            localStorage.setItem('walletAddress', walletAddress);
        } else {
            localStorage.removeItem('walletAddress');
        }
    }, [walletAddress]);

    const updateWallet = (address) => {
        setWalletAddress(address);
    };

    const clearWallet = () => {
        setWalletAddress(null);
    };

    return (
        <WalletContext.Provider value={{ walletAddress, updateWallet, clearWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
