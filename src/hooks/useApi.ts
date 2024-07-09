import { useState } from 'react';
import { useAsync, useLocalStorage, useToggle } from 'react-use';
import { JsonRpcApi } from '@/types';
import { DedotClient, LegacyClient, WsProvider } from 'dedot';

type UseApi = {
  ready: boolean;
  jsonRpc: JsonRpcApi;
  api?: DedotClient;
  legacy?: LegacyClient;
};

export default function useApi(networkEndpoint?: string): UseApi {
  const [jsonRpc, setJsonRpc] = useLocalStorage<JsonRpcApi>('SETTINGS/JSON_RPC_API', JsonRpcApi.NEW);
  const [cacheMetadata, setCacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA',true);

  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<DedotClient>();
  const [legacy, setLegacy] = useState<LegacyClient>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    if (legacy) {
      await legacy.disconnect()
    }

    setReady(false);

    const provider = new WsProvider(networkEndpoint);

    if (jsonRpc == JsonRpcApi.LEGACY) {
      setLegacy(await LegacyClient.new({ provider, cacheMetadata }));
      setApi(undefined);
    } else {
      setApi(await DedotClient.new({ provider, cacheMetadata }));
      setLegacy(undefined)
    }

    setReady(true);
  }, [jsonRpc, networkEndpoint]);

  return { ready, api, legacy, jsonRpc: jsonRpc! };
}
