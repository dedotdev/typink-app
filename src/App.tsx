import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import GreetBoard from '@/components/GreeterBoard.tsx';
import Psp22Board from '@/components/Psp22Board.tsx';
import MainFooter from '@/components/shared/MainFooter';
import MainHeader from '@/components/shared/MainHeader';

function App() {
  return (
    <Flex direction='column' minHeight='100vh'>
      <MainHeader />
      <Box maxWidth='container.md' mx='auto' my={4} px={4} flex={1} w='full'>
        <Tabs isLazy>
          <TabList>
            <Tab>Greeter Contract</Tab>
            <Tab>PSP22 Contract</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <GreetBoard />
            </TabPanel>
            <TabPanel>
              <Psp22Board />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <MainFooter />
    </Flex>
  );
}

export default App;
