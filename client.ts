import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import type { PublicClient, WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";

const myPrivateAccount = privateKeyToAccount('0x0') 

const publicClient = createPublicClient({ 
  chain: mainnet,
  transport: http()
})

const walletClient = createWalletClient({
    chain: mainnet,
    transport: http()
  })

export async function createContract({
  publicClient,
  walletClient,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
}) {
  const creatorClient = create1155CreatorClient({ publicClient });
  const { request } = await creatorClient.createNew1155Token({
    contract: {
      name: "testContract",
      uri: "https://rick-frame-m413.vercel.app/nft",
    },
    tokenMetadataURI: "https://rick-frame-m413.vercel.app/nft",
    account: '0xbFbbeDd977a055B8550fE35331069caBD8a4B265',
    mintToCreatorCount: 1,
  });
  console.log("request: \n", request)
  const { request: simulateRequest } = await publicClient.simulateContract(request);
  console.log("simulatedRequest: \n", simulateRequest)
  const hash = await walletClient.writeContract(
    {
        address: request.address,
        abi: request.abi,
        args: request.args,
        functionName: request.functionName,
        chain: request.chain,
        account: myPrivateAccount,
    }
  );
  console.log("hash:\n",hash)
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(receipt)
  return receipt;
}


console.log(createContract({publicClient,walletClient}))