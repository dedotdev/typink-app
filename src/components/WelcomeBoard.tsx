import { Box, Heading, Text } from '@chakra-ui/react';
import WalletSelection from '@/components/dialog/WalletSelection';
import React from "react";

export default function WelcomeBoard() {
  return (
    <Box textAlign='center'>
      <Box w={28} mx='auto' mt={8} mb={4}>
        <img src='/dedot-dark-logo.png'/>
      </Box>
      <Heading mb={6} size='lg'>
        Welcome to Dedot Demo Dapp
      </Heading>
      <Text mb={4} fontSize='xl'>
        Connect to your wallet to getting started
      </Text>
      <WalletSelection/>
    </Box>
  );
}
