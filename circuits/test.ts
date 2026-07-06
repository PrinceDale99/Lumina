import { LocalTestEnvironment } from '@midnight-ntwrk/testkit-js';
const env = new LocalTestEnvironment({ indexer: 8088, node: 9944, proofServer: 6300 });
console.log(env['environmentConfiguration']);
