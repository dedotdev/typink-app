import { useState } from 'react';
import { useBoolean, useDeepCompareEffect } from 'react-use';
import useRefresher from '@/hooks/useRefresher.ts';
import { useApiContext } from '@/providers/ApiProvider.tsx';
import { Args, Pop } from '@/types.ts';
import { Contract, ContractCallOptions, GenericContractApi } from 'dedot/contracts';

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
type ContractQuery<A extends GenericContractApi = GenericContractApi> = OmitNever<{
  [K in keyof A['query']]: K extends string
    ? K extends `${infer Literal}`
      ? {
          message: Literal;
          params: Parameters<A['query'][K]>;
        }
      : never
    : never;
}>;

type UseContractQueryReturnType<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof ContractQuery<T> = keyof ContractQuery<T>,
> = {
  isLoading: boolean;
  loaded: boolean;
  refresh: () => void;
} & Partial<Awaited<ReturnType<T['query'][M]>>>;

export default function useContractQuery<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof ContractQuery<T> = keyof ContractQuery<T>,
>(
  parameters: {
    contract: Contract<T> | undefined;
    func: M;
  } & Args<Pop<Parameters<T['query'][M]>>>,
): UseContractQueryReturnType<T, M> {
  const { defaultCaller } = useApiContext();
  const [isLoading, setIsLoading] = useBoolean(true);
  const [loaded, setLoaded] = useBoolean(false);
  const [result, setResult] = useState<any>();
  const { refresh, refreshCounter } = useRefresher();

  const { contract, func, args = [] } = parameters;

  useDeepCompareEffect(() => {
    (async () => {
      if (!contract || !func || !args) return;

      const callOptions: ContractCallOptions = { caller: defaultCaller };

      const result = await contract.query[func](...args, callOptions);
      setResult(result);
      setIsLoading(false);
      setLoaded(true);
    })();
  }, [contract, func, args, refreshCounter]);

  return {
    isLoading,
    loaded,
    refresh,
    ...(result || {}),
  } as any;
}