import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync, useLocalStorage, useToggle } from 'react-use';
import { JsonRpcApi, NetworkInfo } from '@/types';
import { DedotClient, ISubstrateClient, JsonRpcProvider, LegacyClient, WsProvider } from 'dedot';
import { SubstrateApi } from 'dedot/chaintypes';
import { RpcVersion } from 'dedot/types';

type UseApi = {
  ready: boolean;
  client?: ISubstrateClient<SubstrateApi[RpcVersion]>;
};

export function useClient(network?: NetworkInfo): UseApi {
  const [cacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA', true);

  const [ready, setReady] = useToggle(false);
  const [client, setClient] = useState<ISubstrateClient<SubstrateApi[RpcVersion]>>();

  useAsync(async () => {
    if (!network) {
      return;
    }

    if (client) {
      await client.disconnect();
    }

    setReady(false);

    // TODO might be not a good idea to put the toast here,
    //  but it's okay for now for demo purposes!
    const toastId = toast.info(`Connecting to ${network.name}`, { autoClose: false, isLoading: true });

    const provider: JsonRpcProvider = new WsProvider(network.provider);

    // Using LegacyClient for now in development mode
    if (network.jsonRpcApi === JsonRpcApi.LEGACY) {
      setClient(await LegacyClient.new({ provider, cacheMetadata }));
    } else {
      setClient(await DedotClient.new({ provider, cacheMetadata }));
    }

    setReady(true);

    toast.update(toastId, {
      render: `Connected to ${network.name}`,
      autoClose: 2000,
      isLoading: false,
      type: 'success',
    });
  }, [network?.provider]);

  return { ready, client };
}
