import { Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useAsync, useBoolean } from 'react-use';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { formatBalance } from '@polkadot/util';
import { useApiContext } from '@/providers/ApiProvider';

interface AccountBalancesProps {
  address: string;
}

export default function AccountBalances({ address }: AccountBalancesProps) {
  const { api, network, apiReady } = useApiContext();
  const [loading, setLoading] = useBoolean(true);
  const [balance, setBalance] = useState<FrameSystemAccountInfo>();

  useAsync(async () => {
    if (!api) {
      return;
    }

    setLoading(true);
    const unsubscribe = await api.query.system.account(address, (resp: FrameSystemAccountInfo) => {
      setBalance(resp);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [api, address]);

  const values = [
    {
      label: 'Free Balance',
      amount: balance?.data?.free || 0,
    },
    {
      label: 'Reserved Balance',
      amount: balance?.data?.reserved || 0,
    },
    {
      label: 'Frozen Balance',
      amount: balance?.data?.frozen || 0,
    },
  ];

  return (
    <Stack m={4}>
      {values.map(({ label, amount }) => (
        <Flex key={label} gap={2}>
          <Text>{label}:</Text>
          <Skeleton h={6} minW={10} isLoaded={apiReady && !loading}>
            <strong>
              {formatBalance(amount, {
                decimals: network.decimals,
                withUnit: false,
                forceUnit: network.symbol,
              })}
              &nbsp;
              {network.symbol}
            </strong>
          </Skeleton>
        </Flex>
      ))}
    </Stack>
  );
}
