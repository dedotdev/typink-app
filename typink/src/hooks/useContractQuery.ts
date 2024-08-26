import { useState } from 'react';
import { useBoolean, useDeepCompareEffect } from 'react-use';
import { useRefresher } from '@/hooks/useRefresher.ts';
import { useTypink } from '@/providers/TypinkProvider.tsx';
import { Args, OmitNever, Pop } from '@/types.ts';
import { Contract, ContractCallOptions, GenericContractApi } from 'dedot/contracts';

type ContractQuery<A extends GenericContractApi = GenericContractApi> = OmitNever<{
  [K in keyof A['query']]: K extends string ? (K extends `${infer Literal}` ? Literal : never) : never;
}>;

type UseContractQueryReturnType<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof ContractQuery<T> = keyof ContractQuery<T>,
> = {
  isLoading: boolean;
  refresh: () => void;
} & Partial<Awaited<ReturnType<T['query'][M]>>>;

export function useContractQuery<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof ContractQuery<T> = keyof ContractQuery<T>,
>(
  parameters: {
    contract: Contract<T> | undefined;
    fn: M;
  } & Args<Pop<Parameters<T['query'][M]>>>,
): UseContractQueryReturnType<T, M> {
  const { defaultCaller } = useTypink();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [result, setResult] = useState<any>();
  const { refresh, refreshCounter } = useRefresher();

  const { contract, fn, args = [] } = parameters;

  useDeepCompareEffect(() => {
    (async () => {
      if (!contract || !fn || !args) return;

      const callOptions: ContractCallOptions = { caller: defaultCaller };

      const result = await contract.query[fn](...args, callOptions);
      setResult(result);
      setIsLoading(false);
    })();
  }, [contract, fn, args, refreshCounter]);

  return {
    isLoading,
    refresh,
    ...(result || {}),
  } as any;
}
