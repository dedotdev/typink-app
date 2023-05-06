import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import MainHeader from '@/components/shared/MainHeader';
import { useApiContext } from '@/providers/ApiProvider';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { apiReady, api } = useApiContext();
  const { ready } = useWalletContext();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [injector, setInjector] = useState<any>();

  const enableCoong = async () => {
    // @ts-ignore
    const CoongAPI = window['injectedWeb3']['coongwallet'];
    const response = await CoongAPI.enable('Sample Dapp');
    const approvedAccounts = await response.accounts.get();
    setInjector(response);
    setAccounts(approvedAccounts);

    toast.success(`${approvedAccounts.length} account(s) connected`);
  };

  const transferToken = async (from: string) => {
    if (!api) {
      return;
    }

    try {
      const hash = await api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(from, { signer: injector.signer });
      toast.success(`Transaction successful: ${hash}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const signDummy = async (from: string) => {
    if (!api) {
      return;
    }

    try {
      const result = await injector.signer.signRaw({
        address: from,
        type: 'bytes',
        data: 'This is a raw message to sign',
      });

      toast.success(`Signing successful: ${result.signature}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const signOut = () => {
    setInjector(undefined);
    setAccounts([]);
  };

  return (
    <div>
      <MainHeader />
      <Box maxWidth={600} mx='auto' mt={8}>
        {accounts.length === 0 ? (
          <Box textAlign='center'>
            <Heading as='h1' fontSize='3xl' mb={6} mt={16}>
              <small>Welcome to</small> <br /> Coong Dapp Playground
            </Heading>
            <Text mb={4} fontSize='lg'>
              Connect to your wallet to getting started
            </Text>
            <Button size='lg' colorScheme='primary' variant='solid' onClick={enableCoong} isLoading={!ready}>
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <Box>
            <Flex justify='space-between' align='center' mb={4}>
              <Text fontSize='lg'>
                <strong>{accounts.length}</strong> accounts connected
              </Text>
              <Button onClick={signOut} size='sm' colorScheme='red' variant='outline'>
                Sign out
              </Button>
            </Flex>
            {accounts.map((one) => (
              <Box key={one.address} border={1} borderStyle='solid' borderColor='gray.200' p={4} rounded={2}>
                <div className='mb-2'>
                  Name: <strong>{one.name}</strong>
                </div>
                <div className='mb-2 break-words'>
                  Address: <strong>{one.address}</strong>
                </div>
                <Flex mt={4} gap={4}>
                  <Button isLoading={!apiReady} onClick={() => transferToken(one.address)}>
                    Transfer
                  </Button>
                  <Button isLoading={!apiReady} onClick={() => signDummy(one.address)}>
                    Sign Raw
                  </Button>
                </Flex>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default App;
