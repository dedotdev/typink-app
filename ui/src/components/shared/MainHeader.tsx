import { Box, Container, Flex } from '@chakra-ui/react';
import React from 'react';
import AccountSelection from '@/components/AccountSelection.tsx';
import WalletSelection from '@/components/dialog/WalletSelection.tsx';
import { useTypink } from 'typink';

export default function MainHeader() {
  const { injectedApi } = useTypink();

  return (
    <Box borderBottom={1} borderStyle='solid' borderColor='gray.200'>
      <Container
        maxWidth='container.md'
        px={4}
        mx='auto'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        gap={4}
        h={16}>
        <a href='/ui/public'>
          <Box w={9}>
            <img src='/dedot-dark-logo.png' />
          </Box>
        </a>
        <Flex gap={2}>{injectedApi ? <AccountSelection /> : <WalletSelection />}</Flex>
      </Container>
    </Box>
  );
}
