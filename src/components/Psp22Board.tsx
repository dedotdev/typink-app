import { Box, Heading } from '@chakra-ui/react';
import PendingText from '@/components/shared/PendingText.tsx';
import { ContractId } from '@/contracts/deployments.ts';
import { Psp22ContractApi } from '@/contracts/types/psp22';
import useContract from '@/hooks/useContract.ts';
import useContractQuery from '@/hooks/useContractQuery.ts';
import { useTypink } from '@/providers/TypinkProvider.tsx';
import { formatBalance } from '@/utils/string.ts';

export default function Psp22Board() {
  const { contract } = useContract<Psp22ContractApi>(ContractId.PSP22);
  const { defaultCaller } = useTypink();

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
            {formatBalance(totalSupply, tokenDecimal)} {tokenSymbol}
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
