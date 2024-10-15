"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (amount: string) => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose, onPurchaseComplete }) => {
  const activeAccount = useActiveAccount();
  const toast = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    const purchaseAmount = "100"; // Assuming a fixed purchase amount of 100 RNDZ
    const response = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({ address: activeAccount?.address, amount: purchaseAmount }),
    });

    const data = await response.json();
    console.log({ data });

    if (data.success) {
      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased RNDZ",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      onPurchaseComplete(purchaseAmount); // Pass the purchased amount
    } else {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="5px solid white" bg="black" color="white">
        <ModalHeader>Buy RNDZ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab _selected={{ color: "black", bg: "white" }}>
                Card Payment
              </Tab>
              <Tab _selected={{ color: "black", bg: "white" }}>EFT Payment</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack
                  spacing={4}
                  align="center"
                  justify="center"
                  height="200px"
                >
                  <Text fontSize="2xl" fontWeight="bold">
                    Coming Soon
                  </Text>
                  <Text textAlign="center" color="#a6a6a6">
                    We&apos;re working hard to bring you this payment method.
                    Stay tuned!
                  </Text>
                  <Button isLoading={isLoading} onClick={handleBuy}>
                    Simulate a Purchase
                  </Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack
                  spacing={4}
                  align="center"
                  justify="center"
                  height="200px"
                >
                  <Text fontSize="2xl" fontWeight="bold">
                    Coming Soon
                  </Text>
                  <Text textAlign="center" color="#a6a6a6">
                    We&apos;re working hard to bring you this payment method.
                    Stay tuned!
                  </Text>
                  <Button isLoading={isLoading} onClick={handleBuy}>
                    Simulate a Purchase
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BuyModal;
