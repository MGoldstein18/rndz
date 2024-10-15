"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaBolt, FaCoins, FaGlobeAfrica, FaShieldAlt } from "react-icons/fa";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <VStack spacing={4} alignItems="flex-start">
    <Icon as={icon} boxSize={10} color="white" />
    <Heading as="h3" size="md" fontWeight="bold">
      {title}
    </Heading>
    <Text color="#a6a6a6">{description}</Text>
  </VStack>
);

export default function Features() {
  return (
    <Box bg="black" color="white" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={12} alignItems="flex-start">
          <Heading as="h2" size="2xl" fontWeight="bold">
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={FaBolt}
              title="Instant Settlement"
              description="Experience lightning-fast transactions with near-instantaneous settlement times."
            />
            <Feature
              icon={FaCoins}
              title="Low Fees"
              description="Enjoy transactions with fees less than $0.01, making micro-payments feasible."
            />
            <Feature
              icon={FaGlobeAfrica}
              title="Borderless Transactions"
              description="Send and receive money across South Africa and beyond without traditional barriers."
            />
            <Feature
              icon={FaShieldAlt}
              title="Secure & Stable"
              description="Backed by the South African Rand, ensuring stability and security for your digital assets."
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
