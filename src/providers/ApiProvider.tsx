import { createContext, useContext } from 'react';
import { useLocalStorage } from 'react-use';
import useApi from '@/hooks/useApi';
import { NetworkInfo, Props } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';
import { Dedot } from 'dedot';

interface ApiContextProps {
  api?: Dedot;
  apiReady: boolean;
  network: NetworkInfo;
  setNetwork: (one: NetworkInfo) => void;
}

const DEFAULT_NETWORK = SUPPORTED_NETWORKS['polkadot'];

export const ApiContext = createContext<ApiContextProps>({
  apiReady: false,
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
});

export const useApiContext = () => {
  return useContext(ApiContext);
};

export default function ApiProvider({ children }: Props) {
  const [network, setNetwork] = useLocalStorage<NetworkInfo>('SELECTED_NETWORK', DEFAULT_NETWORK);
  const { ready, api } = useApi(network?.provider);

  return (
    <ApiContext.Provider value={{ api, apiReady: ready, network: network!, setNetwork }}>
      {children}
    </ApiContext.Provider>
  );
}
