import React, { useContext } from "react";
import { WalletContext } from "../../context/WalletContext";
import { HStack, Button, Text } from "@chakra-ui/react";

const Navbar = () => {
  const { account, connectWallet, disconnectWallet } = useContext(WalletContext);

  return (
    <HStack justifyContent="space-between" p={4} bg="gray.900" color="white">
      <Text fontSize="lg">BrotherSwap</Text>
      {account ? (
        <HStack>
          <Text fontSize="sm">{account.slice(0, 6)}...{account.slice(-4)}</Text>
          <Button size="sm" colorScheme="red" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </HStack>
      ) : (
        <Button size="sm" colorScheme="blue" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </HStack>
  );
};

export default Navbar;
