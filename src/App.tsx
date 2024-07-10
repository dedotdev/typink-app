import { Box, Flex } from '@chakra-ui/react';
import MainBoard from '@/components/MainBoard.tsx';
import WelcomeBoard from '@/components/WelcomeBoard';
import MainFooter from '@/components/shared/MainFooter';
import MainHeader from '@/components/shared/MainHeader';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { injectedApi } = useWalletContext();

  return (
    <Flex direction='column' minHeight='100vh'>
      <MainHeader />
      <Box maxWidth='container.md' mx='auto' my={4} px={4} flex={1} w='full'>
        {!!injectedApi ? <MainBoard /> : <WelcomeBoard />}
      </Box>
      <MainFooter />
    </Flex>
  );
}

export default App;
