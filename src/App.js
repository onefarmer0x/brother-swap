import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "../src/components/Navbar/Navbar";
import SwapCard from "../src/components/SwapCard/SwapCard";

function App() {
  return (
    <ChakraProvider>
      <WalletProvider>
        <Navbar />
        <SwapCard />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default App;
