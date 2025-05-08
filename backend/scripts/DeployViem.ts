import { createPublicClient, http,createWalletClient, formatEther, toHex,hexToString } from "viem";
import {  mantleSepoliaTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/Asistencia.sol/Asistencia.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.RPC_PROVIDER || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const publicClient = createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: http(providerApiKey)
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: mantleSepoliaTestnet,
    transport: http(providerApiKey)
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
  console.log("Deployando el contrato");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: ["AsistenciaToken","AST",deployer.account.address],
  });
  console.log("Transaction hash:", hash);
  console.log("Esperando confirmaciones...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Contrato desplegado en:", receipt.contractAddress);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
