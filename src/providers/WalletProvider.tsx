import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync, useBoolean } from 'react-use';
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import CoongSdk from '@coong/sdk';
import { Props, WalletApi, WalletInfo, WalletType } from '@/types';
import { trimTrailingSlash } from '@/utils/string';

interface WalletContextProps {
  walletUrl: string;
  accounts: InjectedAccount[];
  injectedApi?: Injected;
  enableWallet: (id: string) => void;
  signOut: () => void;
  availableWallets: WalletInfo[];
  connectedWallet?: WalletInfo;
}

export const WalletContext = createContext<WalletContextProps>({
  walletUrl: '',
  accounts: [],
  enableWallet: () => {},
  signOut: () => {},
  availableWallets: [],
});

export const useWalletContext = () => {
  return useContext(WalletContext);
};

const DEFAULT_WALLET_URL = 'https://app.coongwallet.io';

const getCustomWalletUrlFromParams = (): string => {
  const params = new URLSearchParams(window.location.search);

  return params.get('walletUrl') || '';
};

const useCoongWalletInitialization = () => {
  const [ready, setReady] = useBoolean(false);
  const { walletUrl } = useWalletContext();

  useAsync(async () => {
    setReady(false);

    try {
      if (!CoongSdk.instance().isInitializedWithUrl(walletUrl)) {
        await CoongSdk.instance().destroy();
        await CoongSdk.instance().initialize(walletUrl);
      }

      setReady(true);
    } catch (e) {
      // TODO handle if CoongSdk initialization goes wrong
      console.log(e);
    }
  }, [walletUrl]);

  return ready;
};

const WALLETS: WalletInfo[] = [
  {
    type: WalletType.WEBSITE,
    name: 'Coong Wallet',
    id: 'coongwallet',
    logo: 'https://app.coongwallet.io/coong-lined-logo.svg',
    useInitialization: useCoongWalletInitialization,
  },
  {
    type: WalletType.EXTENSION,
    name: 'SubWallet',
    id: 'subwallet-js',
    logo: '/subwallet-logo.svg',
  },
  {
    type: WalletType.EXTENSION,
    name: 'Polkadot{.js}',
    id: 'polkadot-js',
    logo: '/polkadot-js-logo.svg',
  },
  {
    type: WalletType.EXTENSION,
    name: 'Talisman',
    id: 'talisman',
    logo: '/talisman-logo.svg',
  },
];

export const getWalletApi = (walletId: string): WalletApi => {
  // @ts-ignore
  return window.injectedWeb3[walletId] as WalletApi;
};

export const isWalletReady = (walletId: string) => {
  // @ts-ignore
  return !!getWalletApi(walletId);
};

export default function WalletProvider({ children }: Props) {
  const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
  const [injectedApi, setInjectedApi] = useState<Injected>();
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo>();

  const walletUrl = trimTrailingSlash(
    getCustomWalletUrlFromParams() || import.meta.env.VITE_COONG_WALLET_URL || DEFAULT_WALLET_URL,
  );

  const enableWallet = async (walletId: string) => {
    const targetWallet = WALLETS.find((one) => one.id === walletId);
    if (!targetWallet) {
      throw new Error('Invalid Wallet ID');
    }

    const walletApi = getWalletApi(walletId);
    if (!walletApi) {
      throw new Error('Wallet is not existed!');
    }

    const response = await walletApi.enable('Sample Dapp');
    const approvedAccounts = await response.accounts.get();

    setConnectedWallet(targetWallet);
    setInjectedApi(response);
    setAccounts(approvedAccounts);

    toast.dismiss();
    toast.success(`${approvedAccounts.length} account(s) connected via ${targetWallet.name}`);
  };

  const signOut = () => {
    setConnectedWallet(undefined);
    setInjectedApi(undefined);
    setAccounts([]);
  };

  return (
    <WalletContext.Provider
      value={{
        walletUrl,
        accounts,
        enableWallet,
        injectedApi,
        signOut,
        availableWallets: WALLETS,
        connectedWallet,
      }}>
      {children}
    </WalletContext.Provider>
  );
}
