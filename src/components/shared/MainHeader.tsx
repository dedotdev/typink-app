import { Box, Container } from '@chakra-ui/react';
import React from 'react';
import NetworkSelection from '@/components/shared/NetworkSelection';

export default function MainHeader() {
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
        <img src='/coong-dapp-logo.svg' alt='Coong Dapp Logo' style={{ maxHeight: 32 }} />
        <NetworkSelection />
      </Container>
    </Box>
  );
}
