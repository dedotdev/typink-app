import { ADDRESS as PSP22_CONTRACT_ADDRESS } from '@/contracts/psp22/pop-network-testnet.ts';
import psp22Meta from '@/contracts/psp22/psp22.json';
import { Psp22ContractApi } from '@/contracts/types/psp22';
import useContract from '@/hooks/useContract.ts';

export default function usePsp22Contract() {
  const { contract } = useContract<Psp22ContractApi>(psp22Meta as any, PSP22_CONTRACT_ADDRESS);

  return {
    contract,
  };
}
