import React from "react";
import ReactDOM from "react-dom/client"; // Use react-dom/client instead of react-dom
import App from "./App";
import "./index.css";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base, bsc } from "wagmi/chains"; // Import the BNB (BSC) chain

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [base], // Restrict to Base and Binance Smart Chain only
  ssr: true,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[base, bsc]}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
