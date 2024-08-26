import { useState } from 'react';
import { useAsync } from 'react-use';
import { useTypink } from '@/providers/TypinkProvider.tsx';
import { Contract, GenericContractApi } from 'dedot/contracts';

export function useContract<T extends GenericContractApi = GenericContractApi>(contractId: string) {
  const { deployments } = useTypink();
  const { client, network } = useTypink();
  const [contract, setContract] = useState<Contract<T>>();

  useAsync(async () => {
    if (!client || !network) {
      if (contract) {
        setContract(undefined);
      }

      return;
    }

    const deployment = deployments.find((d) => d.id === contractId && d.network === network.id);
    if (!deployment) {
      console.error(`Contract deployment with id: ${contractId} not found on network: ${network.id}`);
      return;
    }

    setContract(new Contract<T>(client, deployment.metadata, deployment.address));
  }, [client, network]);

  return {
    contract,
  };
}
