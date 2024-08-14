import { useMemo, useState } from 'react';
import { useWalletContext } from '@/providers/WalletProvider.tsx';
import { Args, Pop } from '@/types.ts';
import { Contract, ContractCallOptions, ContractTxOptions, GenericContractApi } from 'dedot/contracts';
import { ISubmittableResult } from 'dedot/types';
import { assert, deferred } from 'dedot/utils';

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
      callback?: (result: ISubmittableResult) => void;
      // TODO status callback, signer option
    } & Args<Pop<Parameters<T['tx'][M]>>>,
  ): Promise<void>;
  isInProgress: boolean;
};

export default function useContractTx<
  T extends GenericContractApi = GenericContractApi,
  M extends keyof UseContractTx<T> = keyof UseContractTx<T>,
>(contract: Contract<T> | undefined, func: M): UseContractTxReturnType<T, M> {
  const [isInProgress, setIsInProgress] = useState(false);
  const { selectedAccount } = useWalletContext();

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
          func,
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
    func: M;
    txOptions?: Partial<ContractTxOptions>; // TODO customize SignerOptions
    callback?: (result: ISubmittableResult) => void;
  } & Args<Pop<Parameters<T['tx'][M]>>>,
): Promise<void> {
  // assertions

  // TODO check if balance is sufficient

  const defer = deferred<void>();

  const signAndSend = async () => {
    const { contract, func, args = [], caller, txOptions = {}, callback } = parameters;

    // TODO dry running

    const dryRunOptions: ContractCallOptions = { caller };

    const dryRun = await contract.query[func](...args, dryRunOptions);
    console.log('Dry run result:', dryRun);

    // TODO check if data is a Result with error
    const {
      raw: { gasRequired },
    } = dryRun;

    const actualTxOptions: ContractTxOptions = {
      gasLimit: gasRequired,
      ...txOptions,
    };

    await contract.tx[func](...args, actualTxOptions).signAndSend(caller, (result) => {
      callback && callback(result);

      const {
        status: { type },
      } = result;

      if (type === 'Finalized' || type === 'Invalid' || type === 'Drop') {
        defer.resolve();
      }
    });
  };

  signAndSend().catch(defer.reject);

  return defer.promise;
}