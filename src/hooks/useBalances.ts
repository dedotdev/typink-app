import { useState } from 'react';
import { useAsync } from 'react-use';
import { useApiContext } from '@/providers/ApiProvider.tsx';

export interface Balances {
  [address: string]: {
    free: bigint;
    reserved: bigint;
    frozen: bigint;
  };
}

export default function useBalances(accounts: string[]) {
  const [balances, setBalances] = useState<Balances>({});
  const { api } = useApiContext();

  useAsync(async () => {
    if (!api) {
      setBalances({});

      return;
    }

    return await api.query.system.account.multi(accounts, (balances) => {
      setBalances(
        balances.reduce((balances, accountInfo, currentIndex) => {
          balances[accounts[currentIndex]] = accountInfo.data;
          return balances;
        }, {} as Balances),
      );
    });
  }, [api, accounts]);

  return balances;
}
