import * as smoldot from 'smoldot/no-auto-bytecode';
import type { SmoldotBytecode, Client, Chain } from "smoldot/no-auto-bytecode";
import SmoldotWorker from '../worker?worker'

let client: Client | null = null;
export const startSmoldot = async (): Promise<Client> => {
  if (client) return client;

  const worker = new SmoldotWorker()

  const bytecode = new Promise<SmoldotBytecode>((resolve) => {
    worker.onmessage = (event) => resolve(event.data);
  });

  const { port1, port2 } = new MessageChannel();
  worker.postMessage(port1, [port1]);

  client = smoldot.startWithBytecode({
    bytecode,
    portToWorker: port2,
  });

  return client;
}

export const newSmoldotChain = async (chainSpec: string): Promise<Chain> => {
  const client = await startSmoldot();

  return client.addChain({ chainSpec })
}
