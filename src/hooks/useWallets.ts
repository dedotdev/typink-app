import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { trimTrailingSlash } from '@/utils/string';
import ExtensionWallet from '@/wallets/ExtensionWallet';
import Wallet from '@/wallets/Wallet';
import WebsiteWallet from '@/wallets/WebsiteWallet';

const DEFAULT_COONGWALLET_URL = 'https://app.coongwallet.io';
const DEFAULT_COONGWALLET_ID = 'coongwallet';

const getCustomWalletUrlFromParams = (): string => {
  const params = new URLSearchParams(window.location.search);

  return params.get('walletUrl') || '';
};

const getWalletUrl = () => {
  return trimTrailingSlash(
    getCustomWalletUrlFromParams() || import.meta.env.VITE_COONGWALLET_URL || DEFAULT_COONGWALLET_URL,
  );
};

const A_WALLETS: Wallet[] = [
  new WebsiteWallet({
    name: 'Coong Wallet',
    id: DEFAULT_COONGWALLET_ID,
    logo: '/coong-lined-logo.svg',
    walletUrl: getWalletUrl(),
  }),
  new ExtensionWallet({
    name: 'SubWallet',
    id: 'subwallet-js',
    logo: '/subwallet-logo.svg',
    installUrl: '',
  }),
  new ExtensionWallet({
    name: 'Talisman',
    id: 'talisman',
    logo: '/talisman-logo.svg',
    installUrl: '',
  }),
  new ExtensionWallet({
    name: 'Polkadot{.js}',
    id: 'polkadot-js',
    logo: '/polkadot-js-logo.svg',
    installUrl: '',
  }),
];

export default function useWallets(): Wallet[] {
  const [wallets, setWallets] = useState<Wallet[]>(A_WALLETS);

  useEffectOnce(() => {
    for (let wallet of wallets) {
      wallet
        .initialize()
        .then(() => {
          setWallets([...wallets]);
        })
        .catch(() => {
          // TODO: handle error here!
        });
    }
  });

  return wallets;
}
