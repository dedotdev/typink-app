import { Box, Heading, Text } from '@chakra-ui/react';
import WalletSelection from '@/components/dialog/WalletSelection';
import React from "react";

export default function WelcomeBoard() {
  return (
    <Box textAlign='center'>
      <Box w={28} mx='auto' mt={8} mb={4}>
        <img src='/dedot-dark-logo.png'/>
      </Box>
      <Text as='h1'
            bgGradient='linear(to-l, #7928CA, #FF0080)'
            bgClip='text'
            fontSize='3xl'
            fontWeight='bold'
            mb={4}
      >
        Welcome to Dedot Demo Dapp
      </Text>
      <Text mb={4} fontSize='xl'>
        Connect to your wallet to getting started
      </Text>
      <WalletSelection/>
    </Box>
  );
}
