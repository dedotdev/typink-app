import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync, useLocalStorage, useToggle } from 'react-use';
import { NetworkInfo } from '@/types';
import { DedotClient, JsonRpcProvider, LegacyClient, WsProvider } from 'dedot';

type UseApi = {
  ready: boolean;
  api?: DedotClient;
  legacy?: LegacyClient;
};

export default function useApi(network?: NetworkInfo): UseApi {
  const [cacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA', true);

  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<DedotClient>();
  const [legacy, setLegacy] = useState<LegacyClient>();

  useAsync(async () => {
    if (!network) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    if (legacy) {
      await legacy.disconnect();
    }

    setReady(false);

    let provider: JsonRpcProvider;

    // TODO might be not a good idea to put the toast here,
    //  but it's okay for now for demo purposes!
    const toastId = toast.info(`Connecting to ${network.name}`, { autoClose: false, isLoading: true });

    provider = new WsProvider(network.provider);

    setApi(await DedotClient.new({ provider, cacheMetadata }));
    setLegacy(undefined);
    // setLegacy(await LegacyClient.new({ provider, cacheMetadata }));
    // setApi(undefined);

    setReady(true);

    toast.update(toastId, {
      render: `Connected to ${network.name}`,
      autoClose: 2000,
      isLoading: false,
      type: 'success',
    });
  }, [network?.provider]);

  return { ready, api, legacy };
}
