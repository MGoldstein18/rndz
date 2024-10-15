"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  ButtonGroup,
  Stack,
} from "@chakra-ui/react";
import { createThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  darkTheme,
  lightTheme,
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import { chain } from "../utils/chain";
import { inAppWallet, createWallet, Wallet } from "thirdweb/wallets";
import Link from 'next/link';

export default function Hero() {
  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

  if (!clientId) {
    throw new Error("No client ID provided");
  }

  const client = createThirdwebClient({ clientId });

  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  console.log({ wallet });

  console.log({ activeAccount });

  return (
    <Box bg="black" color="white" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} alignItems="flex-start">
          <Stack direction={["column", "row"]} spacing={8} alignItems="center">
            <Image src="/logo.png" alt="Stablecoin Logo" boxSize="100px" />
            <VStack alignItems="flex-start" spacing={2}>
              <Heading as="h1" size="3xl" fontWeight="bold">
                The South African Rand Stablecoin
              </Heading>
              <Text fontSize="xl" color="#a6a6a6">
                The future of digital currency, backed by the South African Rand
              </Text>
            </VStack>
          </Stack>
          <Text fontSize="lg" maxW="2xl">
            Experience the stability of the South African Rand with the
            flexibility of blockchain. Secure, efficient, and borderless
            financial solution.
          </Text>
          {!activeAccount?.address ? (
            <HStack spacing={4}>
              <ConnectButton
                connectButton={{
                  label: "Get Started",
                }}
                theme={darkTheme({
                  colors: {
                    primaryButtonBg: "white",
                    primaryButtonText: "black",
                  },
                })}
                wallets={[
                  inAppWallet(
                    // built-in auth methods
                    {
                      auth: {
                        options: ["google", "apple", "facebook", "email"],
                      },
                    }
                    // or bring your own auth endpoint
                  ),
                ]}
                chain={chain}
                client={client}
              />

              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                color="white"
              >
                Learn More
              </Button>
            </HStack>
          ) : (
            <ButtonGroup
              alignItems={["center", "start"]}
              width={"100%"}
              flexDir={"column"}
            >
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                color="white"
                width={"50%"}
                as={Link}
                href="/account"
              >
                Go to My Account
              </Button>
              <Button
                size="lg"
                variant="ghost"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                color="white"
                width={"50%"}
                onClick={() => disconnect(wallet as Wallet)}
              >
                Sign Out
              </Button>
            </ButtonGroup>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
