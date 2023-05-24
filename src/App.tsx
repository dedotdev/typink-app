import { Box, Button, Flex, Text } from '@chakra-ui/react';
import AccountSelection from '@/components/AccountSelection';
import WelcomeBoard from '@/components/WelcomeBoard';
import WalletSelection from '@/components/dialog/WalletSelection';
import MainHeader from '@/components/shared/MainHeader';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { accounts, signOut, injectedApi, connectedWallet } = useWalletContext();

  return (
    <div>
      <MainHeader />
      <Box maxWidth={600} mx='auto' mt={8}>
        {!!injectedApi ? (
          <Box>
            <Flex justify='space-between' align='center' gap={4}>
              <Flex align='center' gap={3}>
                <img src={connectedWallet?.logo} alt={connectedWallet?.name} width={32} />
                <Flex direction='column'>
                  <Text fontWeight='600'>{connectedWallet?.name}</Text>
                  <Text fontSize='14'>
                    {connectedWallet?.id} - v{connectedWallet?.version}
                  </Text>
                </Flex>
              </Flex>
              <Flex gap={2}>
                <WalletSelection buttonLabel='Switch Wallet' buttonProps={{ size: 'sm', variant: 'outline' }} />
                <Button onClick={signOut} size='sm' colorScheme='red' variant='outline'>
                  Sign out
                </Button>
              </Flex>
            </Flex>
            <Flex justify='space-between' align='center' mt={4} mb={2}>
              <Text fontSize='lg'>
                <strong>{accounts.length}</strong> accounts connected
              </Text>
            </Flex>
            <AccountSelection />
          </Box>
        ) : (
          <WelcomeBoard />
        )}
      </Box>
    </div>
  );
}

export default App;
