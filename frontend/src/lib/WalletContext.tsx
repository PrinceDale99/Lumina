"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";

interface WalletContextType {
  pubKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [pubKey, setPubKey] = useState<string | null>(null);

  useEffect(() => {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: defaultModules(),
    });
    
    StellarWalletsKit.getAddress().then(({ address }) => {
      if (address) setPubKey(address);
    }).catch(() => {});
  }, []);

  const connect = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      setPubKey(address);
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    try {
      await StellarWalletsKit.disconnect();
      setPubKey(null);
    } catch (e) {
      console.error(e);
      setPubKey(null);
    }
  };

  return (
    <WalletContext.Provider value={{ pubKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
