"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { getContract, defineChain, createThirdwebClient } from "thirdweb";
import { toUnits } from "thirdweb/utils";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSellComplete: (amount: string) => void;
}

const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  onSellComplete,
}) => {
  const activeAccount = useActiveAccount();
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();

  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

  if (!clientId) {
    throw new Error("No client ID provided");
  }

  const client = createThirdwebClient({ clientId });

  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x3648C7281C6CD0418E9426e52f23a3948fE5ca23",
  });

  const handleSell = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const amountInWei = toUnits(amount, 18);
      const transaction = prepareContractCall({
        contract,
        method: "function burn(uint256 _amount)",
        params: [amountInWei],
      });

      sendTransaction(transaction, {
        onError: (error) => {
          console.error(error);
          toast({
            title: "Sell Failed",
            description: "There was an error processing your sell request",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
        onSuccess: (result) => {
          console.log({ result });
        },
      });

      toast({
        title: "Sell Successful",
        description: `You have successfully sold ${amount} RNDZ`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
        onSellComplete(amount);
        onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Sell Failed",
        description: "There was an error processing your sell request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="5px solid white" bg="black" color="white">
        <ModalHeader>Sell RNDZ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="center" justify="center">
            <Text fontSize="xl" fontWeight="bold">
              Enter the amount of RNDZ to sell
            </Text>
            <Input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
            />
            <Button
              isLoading={isLoading}
              onClick={handleSell}
              bg="white"
              color="black"
              _hover={{ bg: "whiteAlpha.800" }}
              width="100%"
            >
              Sell RNDZ
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SellModal;
