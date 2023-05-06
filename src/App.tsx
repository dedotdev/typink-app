import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import CoongSdk from '@coong/sdk';
import { useApiContext } from '@/providers/ApiProvider';

const getCustomizedWalletUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('wallet-url');
};

function App() {
  const walletUrl = getCustomizedWalletUrl() || import.meta.env.VITE_COONG_WALLET_URL || 'http://localhost:3030';
  const [ready, setReady] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [injector, setInjector] = useState<any>();
  const { apiReady, api } = useApiContext();

  useAsync(async () => {
    try {
      await CoongSdk.instance().initialize(walletUrl);
    } catch (e) {
      console.log(e);
    }
    setReady(true);
  });

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

  return (
    <Box mt={8} maxWidth={800} mx='auto'>
      <Heading as='h1' mb={4} textAlign='center'>
        Example Dapp
      </Heading>
      <div>
        {accounts.length === 0 ? (
          <Box textAlign='center'>
            <Button onClick={enableCoong} isLoading={!ready}>
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <Box>
            <Text mb={2}>
              <strong>{accounts.length}</strong> accounts connected
            </Text>
            {accounts.map((one) => (
              <div key={one.address}>
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
              </div>
            ))}
          </Box>
        )}
      </div>
    </Box>
  );
}

export default App;
