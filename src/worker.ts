import * as smoldot from 'smoldot/worker';
import { compileBytecode } from 'smoldot/bytecode';

compileBytecode().then((bytecode) => postMessage(bytecode))
onmessage = (msg) => smoldot.run(msg.data);
