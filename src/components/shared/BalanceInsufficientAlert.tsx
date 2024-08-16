import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Link } from '@chakra-ui/react';
import useBalance from '@/hooks/useBalance.ts';
import { useApiContext } from '@/providers/ApiProvider.tsx';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const DEFAULT_FAUCET_URL = 'https://github.com/use-ink/contracts-ui/blob/master/FAUCETS.md';

export default function BalanceInsufficientAlert() {
  const { network } = useApiContext();
  const { selectedAccount } = useWalletContext();

  const balance = useBalance(selectedAccount?.address);

  if (balance === undefined || balance > 0n) return null;

  return (
    <Alert status='warning' mb={4}>
      <AlertIcon />
      <Box>
        <AlertTitle>Balance insufficient to make transactions</AlertTitle>
        <AlertDescription>
          <Link href={network.faucetUrl || DEFAULT_FAUCET_URL} isExternal>
            Claim some testnet token from faucet now! <ExternalLinkIcon mx='2px' />
          </Link>
        </AlertDescription>
      </Box>
    </Alert>
  );
}
