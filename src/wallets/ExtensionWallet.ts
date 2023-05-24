import Wallet, { WalletOptions } from '@/wallets/Wallet';

interface ExtensionWalletOptions extends WalletOptions {
  installUrl: string;
}

export default class ExtensionWallet extends Wallet<ExtensionWalletOptions> {
  get installUrl() {
    return this.options.installUrl;
  }

  get installed() {
    return this.ready;
  }
}
