import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import useApi from '@/hooks/useApi';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import { NetworkInfo, Props } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';
import { DedotClient, LegacyClient } from 'dedot';

interface ApiContextProps {
  api?: DedotClient;
  legacy?: LegacyClient;
  apiReady: boolean;
  network: NetworkInfo;
  setNetwork: (one: NetworkInfo) => void;
  defaultCaller: string;
}

const DEFAULT_NETWORK = SUPPORTED_NETWORKS['pop_network'];
const DEFAULT_CALLER = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice

export const ApiContext = createContext<ApiContextProps>({
  apiReady: false,
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  defaultCaller: DEFAULT_CALLER,
});

export const useApiContext = () => {
  return useContext(ApiContext);
};

export default function ApiProvider({ children }: Props) {
  const { injectedApi } = useWalletContext();
  const [network, setNetwork] = useLocalStorage<NetworkInfo>('SELECTED_NETWORK', DEFAULT_NETWORK);
  const { ready, api, legacy } = useApi(network);

  useEffect(() => {
    api?.setSigner(injectedApi?.signer);
    legacy?.setSigner(injectedApi?.signer);
  }, [injectedApi, api, legacy]);

  return (
    <ApiContext.Provider
      value={{ api, legacy, apiReady: ready, network: network!, setNetwork, defaultCaller: DEFAULT_CALLER }}>
      {children}
    </ApiContext.Provider>
  );
}
