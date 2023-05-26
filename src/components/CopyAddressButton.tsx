import { Button } from '@chakra-ui/react';
import { useBoolean, useCopyToClipboard } from 'react-use';
import { CopyIcon } from '@chakra-ui/icons';

interface CopyAddressButtonProps {
  address: string;
}

export default function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useBoolean(false);
  const doCopy = () => {
    copyToClipboard(address);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  return (
    <Button onClick={doCopy} leftIcon={<CopyIcon />}>
      {copied ? 'Copied!' : 'Copy Address'}
    </Button>
  );
}
