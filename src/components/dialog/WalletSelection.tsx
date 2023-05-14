import {
  Button,
  ChakraProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { isWalletReady, useWalletContext } from '@/providers/WalletProvider';
import { WalletInfo, WalletType } from '@/types';
import { ThemingProps } from '@chakra-ui/system';

const useDefaultInitialization = () => true;

interface WalletButtonProps {
  walletInfo: WalletInfo;
  afterSelectWallet?: () => void;
}
const WalletButton = ({ walletInfo, afterSelectWallet }: WalletButtonProps) => {
  const { name, id, useInitialization, logo, type } = walletInfo;
  const initialized = useInitialization!();

  const { enableWallet } = useWalletContext();

  const connectWallet = () => {
    enableWallet(id);

    afterSelectWallet && afterSelectWallet();
  };

  const ready = type === WalletType.WEBSITE || isWalletReady(id);

  return (
    <Button
      onClick={connectWallet}
      isLoading={!initialized}
      isDisabled={!ready}
      loadingText={name}
      size='lg'
      width='full'
      justifyContent='flex-start'
      alignItems='center'
      gap={4}>
      <img src={logo} alt={`${name}`} width={24} />
      <span>{name}</span>
    </Button>
  );
};

interface WalletSelectionProps {
  buttonLabel?: string;
  buttonProps?: ChakraProps & ThemingProps<'Button'>;
}

export default function WalletSelection({ buttonLabel = 'Connect Wallet', buttonProps }: WalletSelectionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { availableWallets } = useWalletContext();

  return (
    <>
      <Button size='lg' colorScheme='primary' variant='solid' onClick={onOpen} {...buttonProps}>
        {buttonLabel}
      </Button>
      <Modal onClose={onClose} size='xs' isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Wallet to Connect</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <Stack>
              {availableWallets.map((one) => (
                <WalletButton
                  key={one.id}
                  walletInfo={{ useInitialization: useDefaultInitialization, ...one }}
                  afterSelectWallet={onClose}
                />
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
