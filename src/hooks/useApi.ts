import { useState } from 'react';
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

    provider = new WsProvider(network.provider);

    setApi(await DedotClient.new({ provider, cacheMetadata }));
    setLegacy(undefined);
    // setLegacy(await LegacyClient.new({ provider, cacheMetadata }));
    // setApi(undefined);

    setReady(true);
  }, [network?.provider]);

  return { ready, api, legacy };
}
