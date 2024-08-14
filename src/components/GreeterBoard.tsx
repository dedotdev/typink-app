import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import PendingText from '@/components/shared/PendingText.tsx';
import useContractQuery from '@/hooks/useContractQuery.ts';
import useContractTx from '@/hooks/useContractTx.ts';
import useGreeterContract from '@/hooks/useGreeterContract.ts';
import { txToaster } from '@/utils/txToaster.tsx';

export default function GreetBoard() {
  const contract = useGreeterContract();
  const [message, setMessage] = useState('');
  const setMessageTx = useContractTx(contract, 'setMessage');

  const {
    data: greet,
    isLoading,
    refresh,
  } = useContractQuery({
    contract,
    func: 'greet',
  });

  const handleUpdateGreeting = async () => {
    if (!contract || !message) return;

    const toaster = txToaster('Signing transaction...');

    try {
      await setMessageTx.signAndSend({
        args: [message],
        callback: ({ status, events }) => {
          console.log(status);

          toaster.updateTxStatus(status);

          if (status.type === 'BestChainBlockIncluded') {
            refresh();

            const greetedEvent = contract.events.Greeted.find(events);
            if (greetedEvent) {
              const {
                name,
                data: { from, message },
              } = greetedEvent;

              console.log(`Found a ${name} event sent from: ${from?.address()}, message: ${message}  `);
            }
          }
        },
      });
    } catch (e: any) {
      toaster.onError(e);
    } finally {
      refresh();
      setMessage('');
    }
  };

  return (
    <Container my={8}>
      <Heading size='md'>Greeter Contract</Heading>
      <Flex my={4} gap={2}>
        <Text>Greeting Message:</Text>
        <PendingText fontWeight='600' isLoading={isLoading} color='primary.500'>
          {greet}
        </PendingText>
      </Flex>
      <form>
        <FormControl>
          <FormLabel>Update greeting message:</FormLabel>
          <Input
            type='input'
            maxLength={50}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            isDisabled={setMessageTx.isInProgress}
          />
          <FormHelperText>Max 50 characters</FormHelperText>
        </FormControl>
        <Button size='sm' mt={4} isDisabled={!message || setMessageTx.isInProgress} onClick={handleUpdateGreeting}>
          Update Greeting
        </Button>
      </form>
    </Container>
  );
}
