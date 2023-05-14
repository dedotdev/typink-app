import { ReactNode } from 'react';
import { Injected } from '@polkadot/extension-inject/types';

export interface Props {
  className?: string;
  children?: ReactNode;

  [prop: string]: any;
}

export interface WalletApi {
  version: string;
  enable: (originName: string) => Promise<Injected>;
}

export enum WalletType {
  EXTENSION,
  WEBSITE,
}

export interface WalletInfo {
  type: WalletType;
  id: string;
  name: string;
  logo: string;
  installUrl?: string;
  walletUrl?: string;
  useInitialization?: () => boolean;
}
