import { Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { InjectedAccount } from '@/types';
import AccountBalances from '@/components/AccountBalances';
import CopyAddressButton from '@/components/CopyAddressButton';
import SignRawMessageButton from '@/components/SignRawMessageButton';
import TransferBalanceButton from '@/components/TransferBalanceButton';
import useDisplayAddress from '@/hooks/useDisplayAddress';
import { useWalletContext } from '@/providers/WalletProvider';
import { ChevronDownIcon, ExternalLinkIcon, PlusSquareIcon } from '@chakra-ui/icons';

export default function AccountSelection() {
  const { accounts, injectedApi } = useWalletContext();
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccount>();
  const accountsUpdateAvailable = useMemo(() => !!injectedApi?.accounts?.update, [injectedApi]);
  const displayAddress = useDisplayAddress(selectedAccount?.address);

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
      <Menu autoSelect={false}>
        <MenuButton
          width='full'
          _hover={{ backgroundColor: 'gray.100' }}
          rounded={2}
          border={1}
          borderStyle='solid'
          borderColor='gray.200'>
          <Flex align='center' justify='space-between' gap={4} p={3} textAlign='left' cursor='pointer'>
            <Flex align='center' gap={3}>
              <Flex direction='column'>
                <Text fontWeight='bold' fontSize='lg'>
                  {name}
                </Text>
                <Text>{displayAddress}</Text>
              </Flex>
            </Flex>
            <ChevronDownIcon fontSize='4xl' />
          </Flex>
        </MenuButton>
        <MenuList>
          {accounts.map((one) => (
            <MenuItem
              backgroundColor={one.address === address ? 'gray.200' : ''}
              gap={2}
              key={one.address}
              onClick={() => setSelectedAccount(one)}>
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
      <Flex my={4} gap={4} wrap='wrap'>
        <TransferBalanceButton fromAccount={selectedAccount} />
        <SignRawMessageButton fromAccount={selectedAccount} />
        <CopyAddressButton address={address} />
      </Flex>
      <Box>
        <Link textColor='primary.500' href='https://paritytech.github.io/polkadot-testnet-faucet/' isExternal>
          Polkadot Testnet Faucet <ExternalLinkIcon mx='2px' />
        </Link>
      </Box>
    </Box>
  );
}
