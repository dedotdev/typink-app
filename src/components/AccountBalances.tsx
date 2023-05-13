import { Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useAsync, useBoolean } from 'react-use';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { useApiContext } from '@/providers/ApiProvider';

interface AccountBalancesProps {
  address: string;
}

export default function AccountBalances({ address }: AccountBalancesProps) {
  const { api } = useApiContext();
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
      label: 'Free',
      amount: balance?.data?.free?.toHuman() || 0,
    },
    {
      label: 'Reserved',
      amount: balance?.data?.reserved?.toHuman() || 0,
    },
    {
      label: 'Frozen',
      amount: balance?.data?.frozen?.toHuman() || 0,
    },
  ];

  return (
    <Stack m={4}>
      {values.map(({ label, amount }) => (
        <Flex key={label} gap={2}>
          <Text>{label}:</Text>
          <Skeleton h={6} w={10} isLoaded={!loading}>
            {amount}
          </Skeleton>
        </Flex>
      ))}
    </Stack>
  );
}
