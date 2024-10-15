"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Button,
  Stack,
  useToast,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import {
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
  useAutoConnect,
  useContractEvents,
  ConnectButton,
  darkTheme,
  useReadContract,
} from "thirdweb/react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  toTokens,
} from "thirdweb";
import { inAppWallet, createWallet, Wallet } from "thirdweb/wallets";
import { chain } from "@/app/utils/chain";
import { transferEvent } from "thirdweb/extensions/erc20";
import { shortenAddress } from "thirdweb/utils";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";

const formatNumber = (num: bigint) => {
  return parseFloat(toTokens(num, 18)).toFixed(2).toString();
};

export default function AccountHero() {
  const [balance, setBalance] = useState("");
  const [localBalance, setLocalBalance] = useState<number>(0);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [numberOfTransactions, setNumberOfTransactions] = useState<number>(0);
  // const [events, setEvents] = useState<any[]>([]);

  const toast = useToast();

  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

  if (!clientId) {
    throw new Error("No client ID provided");
  }

  const client = createThirdwebClient({ clientId });

  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x3648C7281C6CD0418E9426e52f23a3948fE5ca23",
  });

  const { data, isPending, refetch } = useReadContract({
    contract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [activeAccount?.address || ""],
  });

  const {
    data: events,
    isPending: isEventsPending,
    refetch: refetchEvents,
  } = useContractEvents({
    contract,
    events: [
      transferEvent({
        from: activeAccount?.address,
        to: "0x0000000000000000000000000000000000000000",
      }),
      transferEvent({
        from: "0x0000000000000000000000000000000000000000",
        to: activeAccount?.address,
      }),
    ],
    blockRange: 16353211,
    enabled: !!activeAccount?.address,
    watch: true,
  });

  useEffect(() => {
    if (data) {
      const formattedBalance = formatNumber(data);
      setBalance(formattedBalance);
      setLocalBalance(parseFloat(formattedBalance));
    }
  }, [data]);

  useEffect(() => {
    if (events) {
      setNumberOfTransactions(events.length);
      const formattedEvents = events.map((event) => {
        return {
          type:
            event.args.from === "0x0000000000000000000000000000000000000000"
              ? "Buy"
              : "Sell",
          amount: formatNumber(event.args.value),
        };
      });

      setTransactionHistory(formattedEvents.splice(-10));
    }
  }, [events]);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const refreshData = (purchasedAmount?: string) => {
    refetch();
    refetchEvents();

    if (purchasedAmount) {
      setLocalBalance(
        (prevBalance) => prevBalance + parseFloat(purchasedAmount)
      );
      const newArray: any[] = [...transactionHistory];
      newArray.push({
        type: purchasedAmount.startsWith("-") ? "Sell" : "Buy",
        amount: purchasedAmount.includes("-")
          ? purchasedAmount.slice(1)
          : purchasedAmount,
      });
      setTransactionHistory(newArray.splice(-10));
      setNumberOfTransactions((prevNumber) => prevNumber + 1);
    }
  };

  return (
    <Box bg="black" color="white" minHeight="120vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={16} alignItems="flex-start">
          <Stack direction={["column", "row"]} spacing={8} alignItems="center">
            <Image src="/logo.png" alt="Stablecoin Logo" boxSize="100px" />
            <VStack alignItems="flex-start" spacing={2}>
              <Heading as="h1" size="3xl" fontWeight="bold">
                My Account
              </Heading>
              <HStack spacing={2} alignItems="center">
                {activeAccount?.address && (
                  <>
                    {" "}
                    <Text fontSize="xl" color="#a6a6a6">
                      {shortenAddress(activeAccount?.address)}
                    </Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="#a6a6a6"
                      onClick={() => {
                        if (activeAccount?.address) {
                          navigator.clipboard.writeText(activeAccount.address);
                          toast({
                            title: "Address copied to clipboard",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      }}
                      aria-label="Copy address"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>
          </Stack>

          {activeAccount?.address && (
            <VStack alignItems="flex-start" spacing={8} width="100%">
              <Heading as="h2" size="xl">
                Account Overview
              </Heading>
              <SimpleGrid columns={[1, 2, 3]} spacing={8} width="100%">
                <Stat>
                  <StatLabel fontSize="lg">Balance</StatLabel>
                  <StatNumber fontSize="3xl" color="green.400">
                    R {localBalance.toFixed(2)}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel fontSize="lg">Total Transactions</StatLabel>
                  <StatNumber fontSize="3xl">{numberOfTransactions}</StatNumber>
                </Stat>
              </SimpleGrid>
            </VStack>
          )}

          <Stack spacing={8} width="100%">
            <Stack direction={["column", "row"]} spacing={4} width="100%">
              <ConnectButton
                connectButton={{
                  label: "Sign In",
                }}
                theme={darkTheme({
                  colors: {
                    primaryButtonBg: "white",
                    primaryButtonText: "black",
                  },
                })}
                wallets={[
                  inAppWallet({
                    smartAccount: {
                      chain: defineChain(84532),
                      sponsorGas: true,
                    },

                    auth: {
                      options: ["google", "apple", "facebook", "email"],
                    },
                  }),
                ]}
                chain={chain}
                client={client}
              />
              <Button
                size="lg"
                bg="white"
                color="black"
                _hover={{ bg: "whiteAlpha.800" }}
                onClick={() => setIsBuyModalOpen(true)}
              >
                Buy RNDZ
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                color="white"
                onClick={() => setIsSellModalOpen(true)}
              >
                Sell RNDZ
              </Button>
              <Button
                size="lg"
                variant="ghost"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
                color="white"
                onClick={() => disconnect(wallet as Wallet)}
              >
                Sign Out
              </Button>
            </Stack>
          </Stack>

          <Divider my={8} />

          <VStack alignItems="flex-start" spacing={8} width="100%">
            <Heading as="h2" size="xl">
              Transaction History
            </Heading>
            <Box width="100%" overflowX="auto">
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th color="white">Type</Th>
                    <Th color="white" isNumeric>
                      Amount
                    </Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactionHistory.map((transaction, index) => (
                    <Tr key={index}>
                      <Td>{transaction.type}</Td>
                      <Td isNumeric>R {transaction.amount}</Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>

          <Divider my={8} />

          <BuyModal
            isOpen={isBuyModalOpen}
            onClose={() => setIsBuyModalOpen(false)}
            onPurchaseComplete={(amount) => refreshData(amount)}
          />

          <SellModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            onSellComplete={(amount) => refreshData(`-${amount}`)}
          />
        </VStack>
      </Container>
    </Box>
  );
}
