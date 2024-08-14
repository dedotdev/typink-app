import { Container, Flex, Heading, Text } from '@chakra-ui/react';
import PendingText from '@/components/shared/PendingText.tsx';
import useContractQuery from '@/hooks/useContractQuery.ts';
import useGreeterContract from '@/hooks/useGreeterContract.ts';

export default function GreetBoard() {
  const contract = useGreeterContract();

  const { data: greet, isLoading } = useContractQuery({
    contract,
    func: 'greet',
  });

  return (
    <Container my={8}>
      <Heading size='md'>Greeter Contract</Heading>
      <Flex my={4} gap={2}>
        <Text>Message:</Text>
        <PendingText fontWeight='600' isLoading={isLoading}>
          {greet}
        </PendingText>
      </Flex>
    </Container>
  );
}
