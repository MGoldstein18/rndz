import { baseSepolia } from "thirdweb/chains";

const activeChain = process.env.ACTIVE_CHAIN;

const chains = {
  sepolia: baseSepolia,
};

export const chain = chains[activeChain as keyof typeof chains];
