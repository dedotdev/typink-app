import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from '@/App';
import ClientProvider from '@/providers/ClientProvider.tsx';
import WalletProvider from '@/providers/WalletProvider';
import { theme } from '@/theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ChakraProvider theme={theme}>
    <WalletProvider>
      <ClientProvider>
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
      </ClientProvider>
    </WalletProvider>
  </ChakraProvider>,
);
