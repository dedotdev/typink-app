import { Box, Button, Flex, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import WalletSelection, { ButtonStyle } from '@/components/dialog/WalletSelection.tsx';
import useBalances from '@/hooks/useBalance.ts';
import useDisplayAddress from '@/hooks/useDisplayAddress';
import { useApiContext } from '@/providers/ApiProvider.tsx';
import { useWalletContext } from '@/providers/WalletProvider';
import { formatBalance, shortenAddress } from '@/utils/string.ts';
import WebsiteWallet from '@/wallets/WebsiteWallet.ts';
import { PlusSquareIcon } from '@chakra-ui/icons';

export default function AccountSelection() {
  const { accounts, injectedApi, selectedAccount, setSelectedAccount, signOut, connectedWallet } = useWalletContext();
  const { network } = useApiContext();
  const addresses = useMemo(() => accounts.map((a) => a.address), [accounts]);
  const balances = useBalances(addresses);

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
        <MenuButton as={Button} variant='outline'>
          <Flex align='center' gap={2}>
            <Text fontWeight='semi-bold' fontSize='md'>
              {name}
            </Text>
            <Text fontSize='sm' fontWeight='400'>
              ({shortenAddress(displayAddress)})
            </Text>
          </Flex>
        </MenuButton>

        <MenuList>
          <Flex align='center' gap={3} flex={1} justify='center' pb={2}>
            <img src={connectedWallet?.logo} alt={connectedWallet?.name} width={24} />
            {connectedWallet instanceof WebsiteWallet ? (
              <Link href={connectedWallet.walletUrl} target='_blank'>
                <Text fontWeight='600' fontSize='14'>
                  {connectedWallet?.name} - v{connectedWallet?.version}
                </Text>
              </Link>
            ) : (
              <Text fontWeight='600' fontSize='14'>
                {connectedWallet?.name} - v{connectedWallet?.version}
              </Text>
            )}
          </Flex>

          {accounts.map((one) => (
            <MenuItem
              backgroundColor={one.address === address ? 'gray.200' : ''}
              gap={2}
              key={one.address}
              onClick={() => setSelectedAccount(one)}>
              <Flex direction='column'>
                <Text fontWeight='500'>{one.name}</Text>

                <Text fontSize='xs'>Address: {shortenAddress(one.address)}</Text>
                <Text fontSize='xs'>
                  Balance: {formatBalance(balances[one.address]?.free) || '0'} {network.symbol}
                </Text>
              </Flex>
            </MenuItem>
          ))}
          <MenuDivider />
          {accountsUpdateAvailable && (
            <MenuItem gap={2} onClick={updateAccounts}>
              <PlusSquareIcon fontSize={24} />
              <span>Add/Remove Accounts</span>
            </MenuItem>
          )}
          <WalletSelection
            buttonStyle={ButtonStyle.MENU_ITEM}
            buttonLabel='Switch Wallet'
            buttonProps={{ color: 'primary.500' }}
          />
          <MenuItem onClick={signOut} color='red.500'>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
