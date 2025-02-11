import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  HStack,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

function TokenSelectModal({ tokens, onSelectToken, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search input
  const handleSearch = async (query) => {
    setSearch(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://starknet.api.avnu.fi/v1/starknet/tokens?page=0&size=30&search=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      const fetchedTokens = data.tokens || data.content || [];
      setSearchResults(fetchedTokens);
    } catch (error) {
      console.error("Error searching tokens:", error);
      setSearchResults([]);
    }
  };

  // Determine which tokens to display
  const displayedTokens = search.trim() ? searchResults : tokens;

  // Function to format token address
  function formatAddress(address) {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  }

  return (
    <>
    <div onClick={onOpen} className="selected-token">
        {token ? (
            <div className="token-info-wrapper">
                <Image src={token.logoUri} boxSize="24px" borderRadius="full" />
                <Text className="text">{token.symbol}</Text>
            </div>
        ) : (
            <Text>Select Token</Text>
        )}
        <i class="fa-solid fa-chevron-down"></i>
    </div>


      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search tokens"
              mb={4}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <VStack spacing={2} align="stretch">
              {displayedTokens.length > 0 ? (
                displayedTokens.map((token) => (
                  <HStack
                    key={token.address}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => {
                      onSelectToken(token);
                      onClose();
                    }}
                  >
                    <Image
                      src={token.logoUri}
                      alt={`${token.name} logo`}
                      boxSize="24px"
                      borderRadius="full"
                      fallbackSrc="https://via.placeholder.com/24"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{token.symbol}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {token.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatAddress(token.address)}
                      </Text>
                    </VStack>
                  </HStack>
                ))
              ) : (
                <Text>No tokens found.</Text>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TokenSelectModal;
