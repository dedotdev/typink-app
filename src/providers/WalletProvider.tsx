import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import CoongSdk from '@coong/sdk';
import { Props } from '@/types';
import { trimTrailingSlash } from '@/utils/string';

interface WalletContextProps {
  walletUrl: string;
  ready: boolean;
  connected: boolean;
  accounts: InjectedAccount[];
  selectedAccount?: InjectedAccount;
  injectedApi?: Injected;
  enableWallet: () => void;
  signOut: () => void;
}

export const WalletContext = createContext<WalletContextProps>({
  walletUrl: '',
  ready: false,
  connected: false,
  accounts: [],
  enableWallet: () => {},
  signOut: () => {},
});

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
  const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccount>();
  const [injectedApi, setInjectedApi] = useState<Injected>();

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

  const enableWallet = async () => {
    // @ts-ignore
    const CoongAPI = window['injectedWeb3']['coongwallet'];
    const response = await CoongAPI.enable('Sample Dapp');
    const approvedAccounts = await response.accounts.get();
    setInjectedApi(response);
    setAccounts(approvedAccounts);
    setSelectedAccount(approvedAccounts[0]);

    toast.success(`${approvedAccounts.length} account(s) connected`);
  };

  const signOut = () => {
    setInjectedApi(undefined);
    setSelectedAccount(undefined);
    setAccounts([]);
  };

  const connected = !!injectedApi;

  return (
    <WalletContext.Provider
      value={{ walletUrl, ready, connected, enableWallet, accounts, injectedApi, signOut, selectedAccount }}>
      {children}
    </WalletContext.Provider>
  );
}
