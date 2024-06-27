import { useState } from 'react';
import { useAsync, useToggle } from 'react-use';
import { DedotClient, WsProvider } from 'dedot';

type UseApi = {
  ready: boolean,
  api?: DedotClient
}

export default function useApi(networkEndpoint?: string): UseApi {
  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<DedotClient>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    setReady(false);

    setApi(await DedotClient.new({ provider: new WsProvider(networkEndpoint), cacheMetadata: true }));

    setReady(true);
  }, [networkEndpoint]);

  return { ready, api };
}
