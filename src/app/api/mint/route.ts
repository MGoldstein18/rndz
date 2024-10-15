import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
  toUnits,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

// create the client with your clientId, or secretKey if in a server environment

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return Response.json({ error: "Address is required" }, { status: 400 });
  }

  const secretKey = process.env.THIRDWEB_SECRET_KEY;

  if (!secretKey) {
    return Response.json({ error: "Secret key is required" }, { status: 400 });
  }

  const client = createThirdwebClient({
    secretKey,
  });

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x3648C7281C6CD0418E9426e52f23a3948fE5ca23",
  });

  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    return Response.json({ error: "Private key is required" }, { status: 400 });
  }

  const account = privateKeyToAccount({
    client,
    privateKey,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function mintTo(address _to, uint256 _amount)",
    params: [address, toUnits("100", 18)],
  });

  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  console.log(transactionHash);

  return Response.json({ success: true });
}
