import greeterMetadata from '@/contracts/greeter/greeter.json';
import psp22Metadata from '@/contracts/psp22/psp22.json';
import { ContractDeployment } from '@/types.ts';
import { NetworkId } from '@/utils/networks.ts';

export enum ContractId {
  GREETER = 'greeter',
  PSP22 = 'psp22',
}

export const greeterDeployments: ContractDeployment[] = [
  {
    id: ContractId.GREETER,
    metadata: greeterMetadata as any,
    network: NetworkId.POP_TESTNET,
    address: '5HJ2XLhBuoLkoJT5G2MfMWVpsybUtcqRGWe29Fo26JVvDCZG',
  },
  {
    id: ContractId.GREETER,
    metadata: greeterMetadata as any,
    network: NetworkId.ALEPHZERO_TESTNET,
    address: '5CDia8Y46K7CbD2vLej2SjrvxpfcbrLVqK2He3pTJod2Eyik',
  },
];

export const psp22Deployments: ContractDeployment[] = [
  {
    id: ContractId.PSP22,
    metadata: psp22Metadata as any,
    network: NetworkId.POP_TESTNET,
    address: '5GSGWox1ZxUkHBAEbm6NPAHLKD28VoQefTRBYTQuydLrxaKJ',
  },
];

export const deployments = [...greeterDeployments, ...psp22Deployments];
