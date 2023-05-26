import { useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { shortenAddress } from '@/utils/string';

export default function useDisplayAddress(inputAddress?: string) {
  const [displayAddress, setDisplayAddress] = useState<string | undefined>(inputAddress);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    setDisplayAddress(isMobile ? shortenAddress(inputAddress) : inputAddress);
  }, [isMobile, inputAddress]);

  return displayAddress;
}
