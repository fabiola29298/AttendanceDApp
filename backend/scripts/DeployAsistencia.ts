import hre from "hardhat";
import { createPublicClient, http,createWalletClient, formatEther, toHex,hexToString } from "viem";
import {  mantleSepoliaTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { keccak256, stringToBytes, getContract } from "viem";
import { abi, bytecode } from "../artifacts/contracts/Asistencia.sol/Asistencia.json";

import * as dotenv from "dotenv";
dotenv.config();
const providerApiKey = process.env.RPC_PROVIDER || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const alumno1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const alumno2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
const palabraSecreta = "solidity"
const duracionSesion = 3 

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
      console.log("Deployando el contrato Votación");
  //Deployar el contrato
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: ["AsistenciaToken","AST",deployer.account.address],
  });
  console.log("Transaction hash:", hash);
  console.log("Esperando confirmaciones...");
  const contratoAsistencia = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Contrato desplegado en:", contratoAsistencia.contractAddress);

  //Verificar el Contrato
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    await hre.run("verify:verify", {
      address: contratoAsistencia.contractAddress,
      constructorArguments: ["AsistenciaToken","AST",deployer.account.address],
    });
    console.log("Contrato Verificado");

  } catch (error) {
    console.log("Error verificando contrato:", error);
  }

  //Insertar los addresses de los alumnos
  const contract = getContract({
    address: hash,
    abi: abi,
    client: {
      public: publicClient,
      wallet: deployer,
    }
  })
 

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
