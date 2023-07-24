import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const {
  chain,
  WagmiConfig,
  createClient,
} = require("wagmi");

const { getDefaultClient } = require("connectkit");

export const rootstock = {
  id: 31,
  name: 'Rootstock',
  network: 'Rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    public: 'https://public-node.testnet.rsk.co',
    default: 'https://public-node.testnet.rsk.co',
  },
  blockExplorers: {
    etherscan: { name: 'Explorer', url: 'https://explorer.testnet.rsk.co/' },
    default: { name: 'Explorer', url: 'https://explorer.testnet.rsk.co/' },
  },
}

const client = createClient(
  getDefaultClient({
    appName: "BNS",
    chains: [rootstock],
  })
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WagmiConfig>
);