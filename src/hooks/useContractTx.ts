import { useMemo } from 'react';
import { useApiContext } from '@/providers/ApiProvider.tsx';
import { Args, Pop } from '@/types.ts';
import { Contract, ContractCallOptions, ContractTxOptions, GenericContractApi } from 'dedot/contracts';
import { deferred } from 'dedot/utils';

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
type UseContractTx<A extends GenericContractApi = GenericContractApi> = OmitNever<{
  [K in keyof A['tx']]: K extends string
    ? K extends `${infer Literal}`
      ? {
          message: Literal;
          params: Parameters<A['tx'][K]>;
        }
      : never
    : never;
}>;

type UseContractTxReturnType<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
> = {
  signAndSend(
    parameters: {
      txOptions?: ContractTxOptions;
      // TODO status callback
    } & Args<Pop<Parameters<T['tx'][M]>>>,
  ): void;
};

export default function useContractTx<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
>(contract: Contract<T> | undefined, func: M): UseContractTxReturnType<T, M> {
  const { defaultCaller } = useApiContext();

  const signAndSend = useMemo(() => {
    return async (o: Parameters<UseContractTxReturnType<T>['signAndSend']>[0]) => {
      if (!contract) return;
      // @ts-ignore
      const { args = [], txOptions } = o;

      // @ts-ignore
      await contractTx({
        contract,
        func,
        args,
        caller: defaultCaller,
        txOptions,
      });
    };
  }, [contract]);

  return {
    signAndSend,
  };
}

export async function contractTx<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
>(
  parameters: {
    contract: Contract<T>;
    caller: string; // | IKeyringPair
    func: M;
    txOptions?: Partial<ContractTxOptions>; // TODO customize SignerOptions
  } & Args<Pop<Parameters<T['tx'][M]>>>,
): Promise<void> {
  const { contract, func, args = [], caller, txOptions = {} } = parameters;

  // assertions

  // check if balance is sufficient

  const defer = deferred<void>();

  const signAndSend = async () => {
    // TODO dry running

    const dryRunOptions: ContractCallOptions = { caller };

    const {
      data,
      raw: { gasRequired },
    } = await contract.query[func](...args, dryRunOptions);

    // TODO check if data is a Result with error

    const actualTxOptions: ContractTxOptions = {
      gasLimit: gasRequired,
      ...txOptions,
    };

    await contract.tx[func](...args, actualTxOptions).signAndSend(caller, (result) => {
      console.log(result);
      const { status } = result;

      if (status.type === 'Finalized') {
        defer.resolve();
      }
    });
  };

  signAndSend().catch(defer.reject);

  return defer.promise;
}
