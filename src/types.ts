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
}
