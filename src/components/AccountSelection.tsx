import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { toast } from 'react-toastify';
import { useApiContext } from '@/providers/ApiProvider';
import { useWalletContext } from '@/providers/WalletProvider';

export default function AccountSelection() {
  const { apiReady, api } = useApiContext();
  const { selectedAccount, injectedApi, connected } = useWalletContext();

  if (!selectedAccount) {
    return <></>;
  }

  const transferToken = async (from: string) => {
    if (!api || !connected) {
      return;
    }

    try {
      const hash = await api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(from, { signer: injectedApi?.signer });
      toast.success(`Transaction successful: ${hash}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const signDummy = async (from: string) => {
    if (!api || !connected) {
      return;
    }

    try {
      // @ts-ignore
      const result = await injectedApi!.signer.signRaw({
        address: from,
        type: 'bytes',
        data: 'This is a raw message to sign',
      });

      toast.success(`Signing successful: ${result.signature}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const { name, address } = selectedAccount;

  return (
    <Box>
      <Flex align='center' gap={3} border={1} borderStyle='solid' borderColor='gray.200' p={3} rounded={2}>
        <Identicon value={address} size={36} theme='polkadot' />
        <Flex direction='column'>
          <Text fontWeight='bold' fontSize='lg'>
            {name}
          </Text>
          <Text>{address}</Text>
        </Flex>
      </Flex>
      <Flex m={4} gap={4}>
        <Button isLoading={!apiReady} onClick={() => transferToken(address)}>
          Transfer
        </Button>
        <Button isLoading={!apiReady} onClick={() => signDummy(address)}>
          Sign Raw
        </Button>
      </Flex>
    </Box>
  );
}
