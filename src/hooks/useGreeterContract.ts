import meta from '@/contracts/greeter/greeter.json';
import { ADDRESS as PSP22_CONTRACT_ADDRESS } from '@/contracts/greeter/pop-network-testnet.ts';
import { GreeterContractApi } from '@/contracts/types/greeter';
import useContract from '@/hooks/useContract.ts';

export default function useGreeterContract() {
  const { contract } = useContract<GreeterContractApi>(meta as any, PSP22_CONTRACT_ADDRESS);

  return {
    contract,
  };
}
