import { Box, Heading } from '@chakra-ui/react';
import PendingText from '@/components/shared/PendingText.tsx';
import useContractQuery from '@/hooks/useContractQuery.ts';
import usePsp22Contract from '@/hooks/usePsp22Contract.ts';
import { useClientContext } from '@/providers/ClientProvider.tsx';
import { formatBalance } from '@/utils/string.ts';

export default function Psp22Board() {
  const contract = usePsp22Contract();
  const { defaultCaller } = useClientContext();

  const { data: tokenName, isLoading: loadingTokenName } = useContractQuery({
    contract,
    fn: 'psp22MetadataTokenName',
  });

  const { data: tokenSymbol, isLoading: loadingTokenSymbol } = useContractQuery({
    contract,
    fn: 'psp22MetadataTokenSymbol',
  });

  const { data: tokenDecimal, isLoading: loadingTokenDecimal } = useContractQuery({
    contract,
    fn: 'psp22MetadataTokenDecimals',
  });

  const { data: totalSupply, isLoading: loadingTotalSupply } = useContractQuery({
    contract,
    fn: 'psp22TotalSupply',
  });

  const { data: balanceOfAlice, isLoading: loadingAliceBalance } = useContractQuery({
    contract,
    fn: 'psp22BalanceOf',
    args: [defaultCaller],
  });

  return (
    <Box>
      <Heading size='md'>PSP22 Contract</Heading>
      <Box mt={4}>
        <Box mb={2}>
          Token Name:{' '}
          <PendingText fontWeight='600' isLoading={loadingTokenName}>
            {tokenName}
          </PendingText>
        </Box>
        <Box mb={2}>
          Token Symbol:{' '}
          <PendingText fontWeight='600' isLoading={loadingTokenSymbol}>
            {tokenSymbol}
          </PendingText>
        </Box>
        <Box mb={2}>
          Token Decimal:{' '}
          <PendingText fontWeight='600' isLoading={loadingTokenDecimal}>
            {tokenDecimal}
          </PendingText>
        </Box>
        <Box mb={2}>
          Total Supply:{' '}
          <PendingText fontWeight='600' isLoading={loadingTotalSupply}>
            {formatBalance(totalSupply)} {tokenSymbol}
          </PendingText>
        </Box>
        <Box mb={2}>
          Alice Balance:{' '}
          <PendingText fontWeight='600' isLoading={loadingAliceBalance}>
            {formatBalance(balanceOfAlice)} {tokenSymbol}
          </PendingText>{' '}
        </Box>
      </Box>
    </Box>
  );
}
