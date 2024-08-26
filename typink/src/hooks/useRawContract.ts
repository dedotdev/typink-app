import { useState } from 'react';
import { useAsync } from 'react-use';
import { useTypink } from '@/providers/TypinkProvider.tsx';
import { Contract, ContractMetadata, GenericContractApi } from 'dedot/contracts';

export function useRawContract<T extends GenericContractApi = GenericContractApi>(
  metadata?: string | ContractMetadata,
  address?: string,
) {
  const { client } = useTypink();
  const [contract, setContract] = useState<Contract<T>>();

  useAsync(async () => {
    if (!client || !metadata || !address) {
      if (contract) {
        setContract(undefined);
      }

      return;
    }

    setContract(new Contract<T>(client, metadata as any, address));
  }, [client, metadata, address]);

  return {
    contract,
  };
}
