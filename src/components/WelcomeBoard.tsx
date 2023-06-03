import { Box, Heading, Text } from '@chakra-ui/react';
import WalletSelection from '@/components/dialog/WalletSelection';

export default function WelcomeBoard() {
  return (
    <Box textAlign='center'>
      <Heading as='h1' fontSize='3xl' mb={6} mt={16}>
        <small>Welcome to</small> <br /> Coong Playground Dapp
      </Heading>
      <Text mb={4} fontSize='lg'>
        Connect to your wallet to getting started
      </Text>
      <WalletSelection />
    </Box>
  );
}
