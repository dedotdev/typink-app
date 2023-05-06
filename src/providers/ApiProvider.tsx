import { createContext, useContext } from 'react';
import { ApiPromise } from '@polkadot/api';
import useApi from '@/hooks/useApi';
import { Props } from '@/types';

interface ApiContextProps {
  api?: ApiPromise;
  apiReady: boolean;
}

export const ApiContext = createContext<ApiContextProps>({ apiReady: false });

const DEFAULT_NETWORK_ENDPOINT = 'wss://rpc.polkadot.io';

export const useApiContext = () => {
  return useContext(ApiContext);
};

export default function ApiProvider({ children }: Props) {
  const { ready, api } = useApi(DEFAULT_NETWORK_ENDPOINT);

  return <ApiContext.Provider value={{ api, apiReady: ready }}>{children}</ApiContext.Provider>;
}
