import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import AccountBalances from '@/components/AccountBalances';
import SignRawMessageButton from '@/components/SignRawMessageButton';
import TransferBalanceButton from '@/components/TransferBalanceButton';
import { useWalletContext } from '@/providers/WalletProvider';
import { ChevronDownIcon, PlusSquareIcon } from '@chakra-ui/icons';

export default function AccountSelection() {
  const { accounts, injectedApi } = useWalletContext();
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccount>();
  const activeItemRef = useRef<HTMLButtonElement | null>(null);
  const accountsUpdateAvailable = useMemo(() => !!injectedApi?.accounts?.update, [injectedApi]);

  useEffect(() => {
    if (selectedAccount && accounts.map((one) => one.address).includes(selectedAccount.address)) {
      return;
    }

    setSelectedAccount(accounts[0]);
  }, [accounts]);

  if (!selectedAccount) {
    return <></>;
  }

  const updateAccounts = async () => {
    if (!accountsUpdateAvailable) {
      return;
    }

    // @ts-ignore
    await injectedApi.accounts.update();
  };

  const { name, address } = selectedAccount;

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
          {accountsUpdateAvailable && (
            <MenuItem gap={2} onClick={updateAccounts}>
              <PlusSquareIcon fontSize={24} />
              <span>Add/Remove Accounts</span>
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <AccountBalances address={address} />
      <Flex my={4} gap={4}>
        <TransferBalanceButton fromAccount={selectedAccount} />
        <SignRawMessageButton fromAccount={selectedAccount} />
      </Flex>
    </Box>
  );
}
