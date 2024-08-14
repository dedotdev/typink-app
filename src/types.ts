import { ReactNode } from 'react';

export interface Props {
  className?: string;
  children?: ReactNode;

  [prop: string]: any;
}

export interface NetworkInfo {
  id: string;
  name: string;
  logo: string;
  provider: string;
  prefix: number;
  symbol: string;
  decimals: number;
  subscanUrl?: string;
  chainSpecFileName?: string;
}

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

export interface InjectedAccount {
  address: string;
  genesisHash?: string | null;
  name?: string;
  type?: KeypairType;
}

export enum Connection {
  RPC_ENDPOINT = 'rpc-endpoint',
  LIGHT_CLIENT = 'light-client',
}

export enum JsonRpcApi {
  LEGACY = 'legacy',
  NEW = 'new',
}

export type Pop<T extends any[]> = T extends [...infer U, any] ? U : never;

export type Args<T> = T extends [] ? { args?: [] | undefined } : { args: T };
