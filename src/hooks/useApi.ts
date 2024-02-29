import { useState } from 'react';
import { useAsync, useToggle } from 'react-use';
import { Dedot } from 'dedot';

type UseApi = {
  ready: boolean,
  api?: Dedot
}

export default function useApi(networkEndpoint?: string): UseApi {
  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<Dedot>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    setReady(false);

    setApi(await Dedot.new({ endpoint: networkEndpoint, cacheMetadata: true }));

    setReady(true);
  }, [networkEndpoint]);

  return { ready, api };
}
