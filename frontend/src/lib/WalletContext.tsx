"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";

interface WalletContextType {
  pubKey: string | null;
  walletType: 'freighter' | 'lace' | null;
  connect: (type?: 'freighter' | 'lace') => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'freighter' | 'lace' | null>(null);

  useEffect(() => {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: defaultModules(),
    });
    
    StellarWalletsKit.getAddress().then(({ address }) => {
      if (address) {
        setPubKey(address);
        setWalletType('freighter');
      }
    }).catch(() => {});
  }, []);

  const connect = async (type: 'freighter' | 'lace' = 'freighter') => {
    try {
      if (type === 'freighter') {
        const { address } = await StellarWalletsKit.authModal();
        setPubKey(address);
        setWalletType('freighter');
      } else if (type === 'lace') {
        const cardano = (window as any).cardano;
        if (cardano && cardano.lace) {
          const api = await cardano.lace.enable();
          const addresses = await api.getUsedAddresses();
          if (addresses && addresses.length > 0) {
            setPubKey(addresses[0]);
            setWalletType('lace');
          }
        } else {
          alert("Lace wallet extension not found! Please install it.");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    try {
      if (walletType === 'freighter') {
        await StellarWalletsKit.disconnect();
      }
      setPubKey(null);
      setWalletType(null);
    } catch (e) {
      console.error(e);
      setPubKey(null);
      setWalletType(null);
    }
  };

  return (
    <WalletContext.Provider value={{ pubKey, walletType, connect, disconnect }}>
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
