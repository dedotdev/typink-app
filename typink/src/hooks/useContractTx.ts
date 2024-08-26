import { useMemo, useState } from 'react';
import { useTypink } from '@/providers/TypinkProvider.tsx';
import { Args, OmitNever, Pop } from '@/types.ts';
import {
  Contract,
  ContractCallOptions,
  ContractTxOptions,
  GenericContractApi,
  isContractDispatchError,
} from 'dedot/contracts';
import { ISubmittableResult } from 'dedot/types';
import { assert, deferred } from 'dedot/utils';

type UseContractTx<A extends GenericContractApi = GenericContractApi> = OmitNever<{
  [K in keyof A['tx']]: K extends string ? (K extends `${infer Literal}` ? Literal : never) : never;
}>;

type UseContractTxReturnType<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
> = {
  signAndSend(
    parameters: {
      txOptions?: ContractTxOptions;
      callback?: (result: ISubmittableResult) => void;
      // TODO status callback, signer option
    } & Args<Pop<Parameters<T['tx'][M]>>>,
  ): Promise<void>;
  isInProgress: boolean;
};

export function useContractTx<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
>(contract: Contract<T> | undefined, fn: M): UseContractTxReturnType<T, M> {
  const [isInProgress, setIsInProgress] = useState(false);
  const { selectedAccount } = useTypink();

  const signAndSend = useMemo(() => {
    return async (o: Parameters<UseContractTxReturnType<T>['signAndSend']>[0]) => {
      assert(contract, 'Contract not found');
      assert(selectedAccount, 'Selected account not found');

      setIsInProgress(true);

      try {
        // @ts-ignore
        const { args = [], txOptions, callback } = o;

        // @ts-ignore
        await contractTx({
          contract,
          fn,
          args,
          caller: selectedAccount.address,
          txOptions,
          callback,
        });
      } finally {
        setIsInProgress(false);
      }
    };
  }, [contract, selectedAccount]);

  return {
    signAndSend,
    isInProgress,
  };
}

export async function contractTx<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
>(
  parameters: {
    contract: Contract<T>;
    caller: string; // | IKeyringPair
    fn: M;
    txOptions?: Partial<ContractTxOptions>; // TODO customize SignerOptions
    callback?: (result: ISubmittableResult) => void;
  } & Args<Pop<Parameters<T['tx'][M]>>>,
): Promise<void> {
  // assertions

  // TODO check if balance is sufficient

  const defer = deferred<void>();

  const signAndSend = async () => {
    const { contract, fn, args = [], caller, txOptions = {}, callback } = parameters;

    try {
      // TODO dry running

      const dryRunOptions: ContractCallOptions = { caller };

      const dryRun = await contract.query[fn](...args, dryRunOptions);
      console.log('Dry run result:', dryRun);

      // TODO check if data is a Result with error
      const {
        raw: { gasRequired },
      } = dryRun;

      const actualTxOptions: ContractTxOptions = {
        gasLimit: gasRequired,
        ...txOptions,
      };

      await contract.tx[fn](...args, actualTxOptions).signAndSend(caller, (result) => {
        callback && callback(result);

        const {
          status: { type },
        } = result;

        if (type === 'Finalized' || type === 'Invalid' || type === 'Drop') {
          defer.resolve();
        }
      });
    } catch (e: any) {
      if (isContractDispatchError(e) && e.dispatchError.type === 'Module') {
        const moduleError = contract.client.registry.findErrorMeta(e.dispatchError);
        if (moduleError) {
          e.message = moduleError.docs.join('');
        }
      }

      throw e;
    }
  };

  signAndSend().catch(defer.reject);

  return defer.promise;
}
