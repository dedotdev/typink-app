import { Box, Button, Flex, Text } from '@chakra-ui/react';
import AccountSelection from '@/components/AccountSelection';
import WelcomeBoard from '@/components/WelcomeBoard';
import WalletSelection from '@/components/dialog/WalletSelection';
import MainFooter from '@/components/shared/MainFooter';
import MainHeader from '@/components/shared/MainHeader';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { accounts, signOut, injectedApi, connectedWallet } = useWalletContext();

  return (
    <Flex direction='column' minHeight='100vh'>
      <MainHeader />
      <Box maxWidth='container.md' mx='auto' my={4} px={4} flex={1} w='full'>
        {!!injectedApi ? (
          <Box>
            <Flex justify='space-between' align='center' gap={4} direction={{ base: 'column', sm: 'row' }}>
              <Flex align='center' gap={3} flex={1}>
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
      <MainFooter />
    </Flex>
  );
}

export default App;
