import React from 'react';
import { toast, TypeOptions, UpdateOptions } from 'react-toastify';
import { TxStatus } from 'dedot/types';

export type TxToaster = {
  updateTxStatus: (status: TxStatus) => void;
  onError: (e: Error) => void;
};

export function txToaster(initialMessage: string = 'Transaction in progress...'): TxToaster {
  const toastId = toast.info(initialMessage, { autoClose: false, isLoading: true });

  const updateTxStatus = (status: TxStatus) => {
    let toastType: TypeOptions = 'default';
    let autoClose: boolean | number = false;
    let toastMessage: string = 'Transaction In Progress...';
    if (status.type === 'Finalized') {
      toastType = 'success';
      autoClose = 5_000;
      toastMessage = 'Transaction successful';
    } else if (status.type === 'Invalid' || status.type === 'Drop') {
      toastType = 'error';
      autoClose = 5_000;
      toastMessage = 'Transaction failed';
    }

    const toastOptions: UpdateOptions = {
      render: (
        <div>
          <p>{toastMessage}</p>
          <p style={{ fontSize: 12 }}>{status.type}</p>
        </div>
      ),
      type: toastType,
      isLoading: !autoClose,
      autoClose,
    };
    toast.update(toastId, toastOptions);
  };

  const onError = (e: Error) => {
    toast.update(toastId, {
      render: (
        <p>
          Tx Error: <b>{e.message}</b>
        </p>
      ),
      type: 'error',
      isLoading: false,
      autoClose: 5_000,
    });
  };

  return {
    updateTxStatus,
    onError,
  };
}
