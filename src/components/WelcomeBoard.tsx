import { Box, Text } from '@chakra-ui/react';
import WalletSelection from '@/components/dialog/WalletSelection';
import React from "react";

export default function WelcomeBoard() {
  return (
    <Box textAlign='center'>
      <Text as='h1'
            bgGradient='linear(to-l, #7928CA, #FF0080)'
            bgClip='text'
            fontSize='3xl'
            fontWeight='bold'
            fontFamily='monospace'
            mt={8} mb={4}
      >
        try.dedot.dev
      </Text>
      <Text mb={4} fontSize='xl'>
        Connect to your wallet to getting started
      </Text>
      <WalletSelection/>
    </Box>
  );
}
