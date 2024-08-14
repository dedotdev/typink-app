// Generated by dedot cli

import type { VersionedGenericSubstrateApi, RpcVersion, RpcV2 } from 'dedot/types';
import type { GenericContractApi } from 'dedot/contracts';
import type { SubstrateApi } from 'dedot/chaintypes';
import type { InkPrimitivesLangError } from './types';
import { ContractQuery } from './query';
import { ContractTx } from './tx';
import { ConstructorQuery } from './constructor-query';
import { ConstructorTx } from './constructor-tx';
import { ContractEvents } from './events';

export * from './types';

export interface Psp22ContractApi<
  Rv extends RpcVersion = RpcV2,
  ChainApi extends VersionedGenericSubstrateApi = SubstrateApi,
> extends GenericContractApi<Rv, ChainApi> {
  query: ContractQuery<ChainApi[Rv]>;
  tx: ContractTx<ChainApi[Rv]>;
  constructorQuery: ConstructorQuery<ChainApi[Rv]>;
  constructorTx: ConstructorTx<ChainApi[Rv]>;
  events: ContractEvents<ChainApi[Rv]>;

  types: {
    LangError: InkPrimitivesLangError;
    ChainApi: ChainApi[Rv];
  };
}