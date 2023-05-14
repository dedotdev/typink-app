import { Box, Button, Flex, Text } from '@chakra-ui/react';
import AccountSelection from '@/components/AccountSelection';
import WelcomeBoard from '@/components/WelcomeBoard';
import WalletSelection from '@/components/dialog/WalletSelection';
import MainHeader from '@/components/shared/MainHeader';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { accounts, signOut, injectedApi } = useWalletContext();

  return (
    <div>
      <MainHeader />
      <Box maxWidth={600} mx='auto' mt={8}>
        {!!injectedApi ? (
          <Box>
            <Flex justify='space-between' align='center' mb={4}>
              <Text fontSize='lg'>
                <strong>{accounts.length}</strong> accounts connected
              </Text>
              <Flex gap={2}>
                <WalletSelection buttonLabel='Switch Wallet' buttonProps={{ size: 'sm', variant: 'outline' }} />
                <Button onClick={signOut} size='sm' colorScheme='red' variant='outline'>
                  Sign out
                </Button>
              </Flex>
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
