import { useState } from 'react';
import { useAsync, useToggle } from 'react-use';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default function useApi(networkEndpoint?: string) {
  const [ready, setReady] = useToggle(false);
  const [api, setApi] = useState<ApiPromise>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    setReady(false);

    const wsProvider = new WsProvider(networkEndpoint);
    setApi(await ApiPromise.create({ provider: wsProvider }));

    setReady(true);
  }, [networkEndpoint]);

  return { ready, api };
}
