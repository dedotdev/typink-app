import { useState } from 'react';
import { useAsync } from 'react-use';
import { ApiPromise, WsProvider } from '@polkadot/api';
import CoongSdk from '@coong/sdk';
import './App.css';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const useApi = (): [boolean, ApiPromise | undefined] => {
  const [ready, setReady] = useState<boolean>(false);
  const [api, setApi] = useState<ApiPromise>();

  useAsync(async () => {
    // const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io');
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    setApi(await ApiPromise.create({ provider: wsProvider }));
    setReady(true);
  }, []);

  return [ready, api];
};

const getCustomizedWalletUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('wallet-url');
}

function App() {
  const walletUrl = getCustomizedWalletUrl() || import.meta.env.VITE_COONG_WALLET_URL || 'http://localhost:3030';
  const [ready, setReady] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [injector, setInjector] = useState<any>();
  const [apiReady, api] = useApi();

  useAsync(async () => {
    try {
      await CoongSdk.instance().initialize(walletUrl);
    } catch (e) {
      console.log(e);
    }
    setReady(true);
  });

  const enableCoong = async () => {
    // @ts-ignore
    const CoongAPI = window['injectedWeb3']['coongwallet'];
    const response = await CoongAPI.enable('Sample Dapp');
    const approvedAccounts = await response.accounts.get();
    setInjector(response);
    setAccounts(approvedAccounts);

    toast.success(`${approvedAccounts.length} account(s) connected`);
  };

  const transferToken = async (from: string) => {
    if (!api) {
      return;
    }

    try {
      const hash = await api.tx.balances
        .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
        .signAndSend(from, { signer: injector.signer });
      toast.success(`Transaction successful: ${hash}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const signDummy = async (from: string) => {
    if (!api) {
      return;
    }

    try {
      const result = await injector.signer.signRaw({ address: from, type: 'bytes', data: 'This is a raw message to sign'});

      toast.success(`Signing successful: ${result.signature}`);
    } catch (e: any) {
      toast.error(e.toString());
    }
  }

  return (
    <div className='App max-w-[800px] mx-auto'>
      <h1 className='text-center text-3xl md:text-5xl'>Example Dapp</h1>
      <div className='card'>
        {accounts.length === 0 ? (
          <div className='text-center'>
            <button onClick={enableCoong} disabled={!ready}>
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p><strong>{accounts.length}</strong> accounts connected</p>
            {accounts.map((one) => (
              <div key={one.address} className='my-4 border border-solid border-gray-400/50 p-4'>
                <div className='mb-2'>
                  Name: <strong>{one.name}</strong>
                </div>
                <div className='mb-2 break-words'>
                  Address: <strong>{one.address}</strong>
                </div>
                <div className='flex gap-4 mt-4'>
                  <button disabled={!apiReady} onClick={() => transferToken(one.address)}>
                    Transfer
                  </button>
                  <button disabled={!apiReady} onClick={() => signDummy(one.address)}>
                    Sign Raw
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer
        position='top-center'
        closeOnClick
        pauseOnHover
        theme='colored'
        autoClose={5_000}
        hideProgressBar
        limit={2}
      />
    </div>
  );
}

export default App;
