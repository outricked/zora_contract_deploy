"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContract = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const protocol_sdk_1 = require("@zoralabs/protocol-sdk");
const myPrivateAccount = (0, accounts_1.privateKeyToAccount)('0x0');
const publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)()
});
const walletClient = (0, viem_1.createWalletClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)()
});
function createContract(_a) {
    return __awaiter(this, arguments, void 0, function* ({ publicClient, walletClient, }) {
        const creatorClient = (0, protocol_sdk_1.create1155CreatorClient)({ publicClient });
        const { request } = yield creatorClient.createNew1155Token({
            contract: {
                name: "testContract",
                uri: "https://rick-frame-m413.vercel.app/nft",
            },
            tokenMetadataURI: "https://rick-frame-m413.vercel.app/nft",
            account: '0xbFbbeDd977a055B8550fE35331069caBD8a4B265',
            mintToCreatorCount: 1,
        });
        console.log("request: \n", request);
        const { request: simulateRequest } = yield publicClient.simulateContract(request);
        console.log("simulatedRequest: \n", simulateRequest);
        const hash = yield walletClient.writeContract({
            address: request.address,
            abi: request.abi,
            args: request.args,
            functionName: request.functionName,
            chain: request.chain,
            account: myPrivateAccount,
        });
        console.log("hash:\n", hash);
        const receipt = yield publicClient.waitForTransactionReceipt({ hash });
        console.log(receipt);
        return receipt;
    });
}
exports.createContract = createContract;
console.log(createContract({ publicClient, walletClient }));
