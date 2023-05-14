import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import AccountBalances from '@/components/AccountBalances';
import { useApiContext } from '@/providers/ApiProvider';
import { useWalletContext } from '@/providers/WalletProvider';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function AccountSelection() {
  const { apiReady, api } = useApiContext();
  const { injectedApi, accounts } = useWalletContext();
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccount>();
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedAccount && accounts.includes(selectedAccount)) {
      return;
    }

    setSelectedAccount(accounts[0]);
  }, [accounts]);

  if (!selectedAccount) {
    return <></>;
  }

  const { name, address } = selectedAccount;

  const transferToken = async () => {
    if (!api || !injectedApi) {
      return;
    }

    try {
      const hash = await api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(address, { signer: injectedApi?.signer });
      toast.success(`Transaction successful: ${hash}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const signDummy = async () => {
    if (!api || !injectedApi) {
      return;
    }

    try {
      // @ts-ignore
      const result = await injectedApi!.signer.signRaw({
        address,
        type: 'bytes',
        data: 'This is a raw message to sign',
      });

      toast.success(`Signing successful: ${result.signature}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  return (
    <Box>
      <Menu initialFocusRef={activeItemRef}>
        <MenuButton
          width='full'
          _hover={{ backgroundColor: 'gray.100' }}
          rounded={2}
          border={1}
          borderStyle='solid'
          borderColor='gray.200'>
          <Flex align='center' justify='space-between' gap={4} p={3} textAlign='left' cursor='pointer'>
            <Flex align='center' gap={3}>
              <Identicon value={address} size={36} theme='polkadot' />
              <Flex direction='column'>
                <Text fontWeight='bold' fontSize='lg'>
                  {name}
                </Text>
                <Text>{address}</Text>
              </Flex>
            </Flex>
            <ChevronDownIcon fontSize='4xl' />
          </Flex>
        </MenuButton>
        <MenuList>
          {accounts.map((one) => (
            <MenuItem
              ref={one.address === address ? activeItemRef : null}
              gap={2}
              key={one.address}
              onClick={() => setSelectedAccount(one)}>
              <Identicon value={one.address} size={24} theme='polkadot' />
              <span>{one.name}</span>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <AccountBalances address={address} />
      <Flex m={4} mt={8} gap={4}>
        <Button isLoading={!apiReady} onClick={transferToken}>
          Transfer
        </Button>
        <Button isLoading={!apiReady} onClick={signDummy}>
          Sign Raw
        </Button>
      </Flex>
    </Box>
  );
}
