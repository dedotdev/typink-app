import { useState } from 'react';
import { useAsync, useToggle } from 'react-use';
import { DelightfulApi } from 'delightfuldot';

export default function useApi(networkEndpoint?: string) {
  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<DelightfulApi>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    setReady(false);

    setApi(await DelightfulApi.new({ endpoint: networkEndpoint, cacheMetadata: true }));

    setReady(true);
  }, [networkEndpoint]);

  return { ready, api };
}
