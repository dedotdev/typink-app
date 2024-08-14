import { Flex, Link, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import React from 'react';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import WebsiteWallet from '@/wallets/WebsiteWallet.ts';

export default function ConnectedWallet() {
  const { connectedWallet } = useWalletContext();
  const walletUrl = connectedWallet instanceof WebsiteWallet ? connectedWallet.walletUrl : undefined;

  return (
    <LinkBox>
      <Flex align='center' gap={3} flex={1} justify='center' pb={2}>
        <LinkOverlay href={walletUrl} isExternal>
          <img src={connectedWallet?.logo} alt={connectedWallet?.name} width={24} />
        </LinkOverlay>
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
    </LinkBox>
  );
}
