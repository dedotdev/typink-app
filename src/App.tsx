import { Box, Divider, Flex } from '@chakra-ui/react';
import GreetBoard from '@/components/GreeterBoard.tsx';
import Psp22Board from '@/components/Psp22Board.tsx';
import MainFooter from '@/components/shared/MainFooter';
import MainHeader from '@/components/shared/MainHeader';
import { useWalletContext } from '@/providers/WalletProvider';

function App() {
  const { injectedApi } = useWalletContext();

  return (
    <Flex direction='column' minHeight='100vh'>
      <MainHeader />
      <Box maxWidth='container.md' mx='auto' my={4} px={4} flex={1} w='full'>
        <GreetBoard />
        <Divider />
        <Psp22Board />
      </Box>
      <MainFooter />
    </Flex>
  );
}

export default App;
