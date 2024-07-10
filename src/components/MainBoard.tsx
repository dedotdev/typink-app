import { useWalletContext } from "@/providers/WalletProvider.tsx";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import WalletSelection from "@/components/dialog/WalletSelection.tsx";
import AccountSelection from "@/components/AccountSelection.tsx";
import ConnectedWallet from "@/components/dialog/ConnectedWallet.tsx";

export default function MainBoard() {
  const { accounts, signOut } = useWalletContext();

  return (
    <Box>
      <Flex justify='space-between' align='center' gap={4} direction={{ base: 'column', sm: 'row' }}>
        <ConnectedWallet />
        <Flex gap={2}>
          <WalletSelection buttonLabel='Switch Wallet' buttonProps={{ size: 'sm', variant: 'outline' }} />
          <Button onClick={signOut} size='sm' colorScheme='red' variant='outline'>
            Sign out
          </Button>
        </Flex>
      </Flex>
      <Flex justify='space-between' align='center' mt={4} mb={2}>
        <Text fontSize='lg'>
          <strong>{accounts.length}</strong> accounts connected
        </Text>
      </Flex>
      <AccountSelection />
    </Box>
  )
}
