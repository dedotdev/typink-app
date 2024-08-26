import { useState } from 'react';
import { useAsync } from 'react-use';
import { useTypink } from '@/providers/TypinkProvider.tsx';

export interface Balances {
  [address: string]: {
    free: bigint;
    reserved: bigint;
    frozen: bigint;
  };
}

export function useBalances(accounts: string[]) {
  const [balances, setBalances] = useState<Balances>({});
  const { client } = useTypink();

  useAsync(async () => {
    if (!client) {
      setBalances({});

      return;
    }

    return await client.query.system.account.multi(accounts, (balances) => {
      setBalances(
        balances.reduce((balances, accountInfo, currentIndex) => {
          balances[accounts[currentIndex]] = accountInfo.data;
          return balances;
        }, {} as Balances),
      );
    });
  }, [client, accounts]);

  return balances;
}
