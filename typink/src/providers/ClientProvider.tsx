import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { useClient } from '@/hooks';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import { NetworkInfo, Props } from '@/types';
import { NetworkId, SUPPORTED_NETWORKS } from '@/utils/networks';
import { ISubstrateClient } from 'dedot';
import { SubstrateApi } from 'dedot/chaintypes';
import { RpcVersion } from 'dedot/types';

export interface ClientContextProps {
  client?: ISubstrateClient<SubstrateApi[RpcVersion]>;
  ready: boolean;
  network: NetworkInfo;
  networkId: NetworkId;
  setNetworkId: (one: NetworkId) => void;
}

const DEFAULT_NETWORK = NetworkId.POP_TESTNET;

export const ClientContext = createContext<ClientContextProps>({
  ready: false,
  network: SUPPORTED_NETWORKS[NetworkId.POP_TESTNET],
  networkId: NetworkId.POP_TESTNET,
  setNetworkId: () => {},
});

export const useClientContext = () => {
  return useContext(ClientContext);
};

export interface ClientProviderProps extends Props {
  defaultNetworkId?: NetworkId;
}

export function ClientProvider({ children, defaultNetworkId = DEFAULT_NETWORK }: ClientProviderProps) {
  const { injectedApi } = useWalletContext();
  const [networkId, setNetworkId] = useLocalStorage<string>('SELECTED_NETWORK_ID', defaultNetworkId);
  const network = useMemo(() => SUPPORTED_NETWORKS[networkId!], [networkId]);

  const { ready, client } = useClient(network);

  useEffect(() => {
    client?.setSigner(injectedApi?.signer);
  }, [injectedApi, client]);

  return (
    <ClientContext.Provider
      key={networkId}
      value={{
        client,
        ready,
        network,
        networkId: networkId as NetworkId,
        setNetworkId,
      }}>
      {children}
    </ClientContext.Provider>
  );
}
