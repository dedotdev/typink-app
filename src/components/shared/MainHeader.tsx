import { Box, Container, Flex } from '@chakra-ui/react';
import React from 'react';
import Settings from '@/components/dialog/Settings';
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
        <a href='/'>
          <Box w={9}>
            <img src='/dedot-dark-logo.png' />
          </Box>
        </a>
        <Flex gap={2}>
          <Settings />
          <NetworkSelection />
        </Flex>
      </Container>
    </Box>
  );
}
