import { createContext, useContext, useState } from 'react';
import { useAsync } from 'react-use';
import CoongSdk from '@coong/sdk';
import { Props } from '@/types';
import { trimTrailingSlash } from '@/utils/string';

interface WalletContextProps {
  walletUrl: string;
  ready: boolean;
}

export const WalletContext = createContext<WalletContextProps>({ walletUrl: '', ready: false });

export const useWalletContext = () => {
  return useContext(WalletContext);
};

const DEFAULT_WALLET_URL = 'https://app.coongwallet.io';

const getCustomWalletUrlFromParams = (): string => {
  const params = new URLSearchParams(window.location.search);

  return params.get('walletUrl') || '';
};

export default function WalletProvider({ children }: Props) {
  const [ready, setReady] = useState<boolean>(false);
  const walletUrl = trimTrailingSlash(
    getCustomWalletUrlFromParams() || import.meta.env.VITE_COONG_WALLET_URL || DEFAULT_WALLET_URL,
  );

  useAsync(async () => {
    setReady(false);
    try {
      await CoongSdk.instance().destroy();
      await CoongSdk.instance().initialize(walletUrl);
    } catch (e) {
      // TODO handle if CoongSdk initialization goes wrong
      console.log(e);
    }

    setReady(true);
  }, [walletUrl]);

  return <WalletContext.Provider value={{ walletUrl, ready }}>{children}</WalletContext.Provider>;
}
