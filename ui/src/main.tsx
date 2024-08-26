import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from '@/App';
import { theme } from '@/theme';
import { deployments } from 'contracts/deployments';
import { NetworkId, TypinkProvider } from 'typink';

const DEFAULT_CALLER = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ChakraProvider theme={theme}>
    <TypinkProvider deployments={deployments} defaultCaller={DEFAULT_CALLER} defaultNetworkId={NetworkId.POP_TESTNET}>
      <App />
      <ToastContainer
        position='top-right'
        closeOnClick
        pauseOnHover
        theme='light'
        autoClose={5_000}
        hideProgressBar
        limit={2}
      />
    </TypinkProvider>
  </ChakraProvider>,
);
