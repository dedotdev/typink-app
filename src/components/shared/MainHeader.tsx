import { Box, Container, Text } from '@chakra-ui/react';
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
        <Text
          bgGradient='linear(to-l, #7928CA, #FF0080)'
          bgClip='text'
          fontSize='2xl'
          fontWeight='bold'
          fontFamily='monospace'
        >
          dedot
        </Text>
        <NetworkSelection />
      </Container>
    </Box>
  );
}
