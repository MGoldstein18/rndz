"use client";

import React from "react";
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
} from "@chakra-ui/react";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="5px solid white" bg="black" color="white">
        <ModalHeader>Buy RNDZ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab _selected={{ color: 'black', bg: 'white' }}>Card Payment</Tab>
              <Tab _selected={{ color: 'black', bg: 'white' }}>EFT Payment</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ComingSoonContent />
              </TabPanel>
              <TabPanel>
                <ComingSoonContent />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ComingSoonContent: React.FC = () => (
  <VStack spacing={4} align="center" justify="center" height="200px">
    <Text fontSize="2xl" fontWeight="bold">
      Coming Soon
    </Text>
    <Text textAlign="center" color="#a6a6a6">
      We&apos;re working hard to bring you this payment method. Stay tuned!
    </Text>
  </VStack>
);

export default BuyModal;
