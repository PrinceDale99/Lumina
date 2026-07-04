"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface WalletContextType {
  pubKey: string | null;
  walletType: 'lace' | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'lace' | null>(null);

  useEffect(() => {
    const cardano = (window as any).cardano;
    if (cardano && cardano.lace) {
      cardano.lace.isEnabled().then((enabled: boolean) => {
        if (enabled) {
          cardano.lace.enable().then((api: any) => {
            api.getUsedAddresses().then((addresses: string[]) => {
              if (addresses && addresses.length > 0) {
                setPubKey(addresses[0]);
                setWalletType('lace');
              }
            });
          });
        }
      }).catch(() => {});
    }
  }, []);

  const connect = async () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    setPubKey(null);
    setWalletType(null);
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
