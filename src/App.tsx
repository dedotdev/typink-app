import { useState } from 'react';
import { useAsync } from 'react-use';
import { ApiPromise, WsProvider } from '@polkadot/api';
import CoongSdk from '@coong/sdk';
import './App.css';

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

function App() {
  const walletUrl = import.meta.env.VITE_COONG_WALLET_URL || 'http://localhost:3030';
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
    console.log(response);
    console.log(approvedAccounts);
    setInjector(response);
    setAccounts(approvedAccounts);
  };

  const transferToken = async (from: string) => {
    if (!api) {
      return;
    }

    api.tx.balances
      .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
      .signAndSend(from, { signer: injector.signer }, (status) => {
        console.log(status);
      });
  };

  return (
    <div className='App'>
      <h1>Sample Dapp</h1>
      <div className='card'>
        {accounts.length === 0 ? (
          <button onClick={enableCoong} disabled={!ready}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>{accounts.length} accounts connected</p>
            <ul>
              {accounts.map((one) => (
                <li key={one.address}>
                  <span>
                    {one.name} - {one.address}
                  </span>
                  <button disabled={!apiReady} onClick={() => transferToken(one.address)}>
                    Transfer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
