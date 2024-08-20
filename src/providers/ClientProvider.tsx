import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import useClient from '@/hooks/useClient.ts';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import { NetworkInfo, Props } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';
import { ISubstrateClient } from 'dedot';
import { SubstrateApi } from 'dedot/chaintypes';
import { RpcVersion } from 'dedot/types';

interface ClientContextProps {
  client?: ISubstrateClient<SubstrateApi[RpcVersion]>;
  ready: boolean;
  network: NetworkInfo;
  setNetwork: (one: NetworkInfo) => void;
  defaultCaller: string;
}

const DEFAULT_NETWORK = SUPPORTED_NETWORKS['pop_network'];
const DEFAULT_CALLER = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice

export const ClientContext = createContext<ClientContextProps>({
  ready: false,
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  defaultCaller: DEFAULT_CALLER,
});

export const useClientContext = () => {
  return useContext(ClientContext);
};

export default function ClientProvider({ children }: Props) {
  const { injectedApi } = useWalletContext();
  const [network, setNetwork] = useLocalStorage<NetworkInfo>('SELECTED_NETWORK', DEFAULT_NETWORK);
  const { ready, client } = useClient(network);

  useEffect(() => {
    client?.setSigner(injectedApi?.signer);
  }, [injectedApi, client]);

  return (
    <ClientContext.Provider value={{ client, ready, network: network!, setNetwork, defaultCaller: DEFAULT_CALLER }}>
      {children}
    </ClientContext.Provider>
  );
}
