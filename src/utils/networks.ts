import { NetworkInfo } from '@/types';

const LOGO_FOLDER =
  'https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/master/packages/chain-list/src/logo';

export const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot',
    logo: `${LOGO_FOLDER}/polkadot.png`,
    provider: 'wss://rpc.polkadot.io',
    prefix: 0,
    symbol: 'DOT',
    decimals: 10,
  },
  kusama: {
    id: 'kusama',
    name: 'Kusama',
    logo: `${LOGO_FOLDER}/kusama.png`,
    provider: 'wss://kusama-rpc.polkadot.io',
    prefix: 2,
    symbol: 'KSM',
    decimals: 12,
  },
  rococo: {
    id: 'rococo',
    name: 'Rococo',
    logo: `${LOGO_FOLDER}/rococo.png`,
    provider: 'wss://rococo-rpc.polkadot.io',
    prefix: 42,
    symbol: 'ROC',
    decimals: 12,
  },
  westend: {
    id: 'westend',
    name: 'Westend',
    logo: `${LOGO_FOLDER}/westend.png`,
    provider: 'wss://westend-rpc.polkadot.io',
    prefix: 42,
    symbol: 'WND',
    decimals: 12,
  },
};
