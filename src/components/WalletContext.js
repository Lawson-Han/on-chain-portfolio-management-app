import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);

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

