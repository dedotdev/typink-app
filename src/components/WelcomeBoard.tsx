import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useWalletContext } from '@/providers/WalletProvider';

export default function WelcomeBoard() {
  const { ready, enableWallet } = useWalletContext();

  // useEffect(() => {
  //   if (!ready) {
  //     return;
  //   }
  //
  //   enableWallet();
  // }, [ready]);

  return (
    <Box textAlign='center'>
      <Heading as='h1' fontSize='3xl' mb={6} mt={16}>
        <small>Welcome to</small> <br /> Coong Dapp Playground
      </Heading>
      <Text mb={4} fontSize='lg'>
        Connect to your wallet to getting started
      </Text>
      <Button size='lg' colorScheme='primary' variant='solid' onClick={enableWallet} isLoading={!ready}>
        Connect Wallet
      </Button>
    </Box>
  );
}
