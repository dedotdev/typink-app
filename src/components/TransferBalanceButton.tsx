import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { validateAddress } from '@polkadot/util-crypto';
import { useApiContext } from '@/providers/ApiProvider';
import { useWalletContext } from '@/providers/WalletProvider';
import { shortenAddress } from '@/utils/string';
import WebsiteWallet from '@/wallets/WebsiteWallet';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface TransferBalanceButtonProps {
  fromAccount: InjectedAccount;
}

const checkAddress = (addressToCheck: string) => {
  try {
    return validateAddress(addressToCheck);
  } catch (e) {
    return false;
  }
};

export default function TransferBalanceButton({ fromAccount }: TransferBalanceButtonProps) {
  const { apiReady, api, network } = useApiContext();
  const { injectedApi, connectedWallet } = useWalletContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [destValidation, setDestValidation] = useState<string>('');

  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [amountValidation, setAmountValidation] = useState<string>('');

  useEffect(() => {
    if (destinationAddress && destinationAddress.length !== 48 && !checkAddress(destinationAddress)) {
      setDestValidation('Invalid destination address');
    } else {
      setDestValidation('');
    }
  }, [destinationAddress]);

  useEffect(() => {
    if (!Number.isFinite(amountToSend) || amountToSend <= 0) {
      setAmountValidation('Amount should be a positive integer');
    } else {
      setAmountValidation('');
    }
  }, [amountToSend]);

  const makeTransfer = async () => {
    if (!!destValidation) {
      return;
    }

    if (!api || !injectedApi) {
      return;
    }

    try {
      if (connectedWallet instanceof WebsiteWallet) {
        await connectedWallet.sdk?.launchNewWalletInstance('/request');
      }

      const hash = await api.tx.balances
        .transfer(destinationAddress, amountToSend * Math.pow(10, network.decimals))
        .signAndSend(fromAccount.address, { signer: injectedApi?.signer });

      toast.success(`Transaction approved: ${hash}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  return (
    <>
      <Button isLoading={!apiReady} onClick={onOpen} leftIcon={<ExternalLinkIcon />}>
        Transfer
      </Button>
      <Modal onClose={onClose} size='lg' isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transfer Balance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor='fromAddressInput'>From Account</FormLabel>
              <InputGroup size='lg'>
                <InputLeftElement pointerEvents='none'>
                  <Identicon value={fromAccount.address} size={24} theme='polkadot' />
                </InputLeftElement>
                <Input
                  id='fromAddressInput'
                  type='text'
                  placeholder='From Address'
                  value={`${fromAccount.name} (${shortenAddress(fromAccount.address)})`}
                  readOnly
                />
              </InputGroup>
            </FormControl>

            <FormControl mt={4} isInvalid={!!destValidation}>
              <FormLabel htmlFor='toAddressInput'>Destination Address</FormLabel>
              <InputGroup size='lg'>
                <InputLeftElement pointerEvents='none'>
                  <Identicon value={destinationAddress} size={24} theme='polkadot' />
                </InputLeftElement>
                <Input
                  id='toAddressInput'
                  type='text'
                  placeholder='To Address'
                  autoFocus
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                />
              </InputGroup>
              <FormErrorMessage>{destValidation}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!amountValidation}>
              <FormLabel htmlFor='amountToTransferInput'>Amount To Transfer</FormLabel>
              <InputGroup size='lg'>
                <Input
                  id='amountToTransferInput'
                  type='number'
                  placeholder='Amount To Transfer'
                  value={amountToSend}
                  onChange={(e) => setAmountToSend(parseInt(e.target.value))}
                />
                <InputRightAddon>{network.symbol}</InputRightAddon>
              </InputGroup>
              <FormErrorMessage>{amountValidation}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme='primary' isDisabled={!!destValidation || !!amountValidation} onClick={makeTransfer}>
              Make Transfer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
