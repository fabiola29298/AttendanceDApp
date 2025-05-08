import {
  createPublicClient,
  http,
  createWalletClient,
  keccak256, // For hashing the secret word
  toHex,      // To convert string to hex for hashing
  // stringToBytes, // Alternative for keccak256 if you prefer
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mantleSepoliaTestnet } from "viem/chains";
import { abi } from "../artifacts/contracts/Asistencia.sol/Asistencia.json"; // Adjust path if needed
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.RPC_PROVIDER || "";
const professorPrivateKey = process.env.PRIVATE_KEY || ""; // This is the deployer with PROFE_ROLE

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";  

async function main() { 
  if (!professorPrivateKey) {
    console.error(
      "Please ensure PRIVATE_KEY is set in your .env file for the professor."
    );
    process.exit(1);
  }

  const publicClient = createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: http(providerApiKey),
  });

  const professorAccount = privateKeyToAccount(`0x${professorPrivateKey}`);
  const profesorWalletClient = createWalletClient({
    account: professorAccount,
    chain: mantleSepoliaTestnet,
    transport: http(providerApiKey),
  });

  console.log("Professor address:", profesorWalletClient.account.address);
  console.log("Interacting with contract at:", CONTRACT_ADDRESS);

  // --- 1. Registrar Alumno ---
  const alumnoAddressToRegister = "0x7496E003D30D861A8922AFfDDd98Ca0FF2a04A5a"; // Replace with a real student address
  // You can also register multiple students by calling this multiple times
  // or by modifying the contract to accept an array of students.

  try {
    console.log(`\nRegistrando alumno: ${alumnoAddressToRegister}...`);
    const registerTxHash = await profesorWalletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: abi,
      functionName: "registrarAlumno",
      args: [alumnoAddressToRegister as `0x${string}`],
      account: profesorWalletClient.account, // Explicitly stating the account
    });
    console.log("Transaction hash (registrarAlumno):", registerTxHash);
    const registerReceipt = await publicClient.waitForTransactionReceipt({
      hash: registerTxHash,
    });
    console.log(
      "Alumno registrado:",
      registerReceipt.status === "success" ? "OK" : "Failed"
    );
    if (registerReceipt.status !== "success") {
      console.error("Failed to register student:", registerReceipt);
    }
  } catch (error) {
    console.error("Error registrando alumno:", error);
  }

  // --- 2. Crear Primera Sesión ---
  const palabraSecreta = "mantleRifa"; // The secret word for the session
  const duracionEnDias = 7;         // Session duration in days

  // Solidity's keccak256(abi.encodePacked(_palabra)) for a string is equivalent to
  // hashing the UTF-8 bytes of the string.
  // `toHex(palabraSecreta, { Hextype: 'bytes' })` can also be used to be more explicit about byte representation.
  // Or using `stringToBytes` as in your example: `const hashPalabra = keccak256(stringToBytes(palabraSecreta));`
  const hashPalabra = keccak256(toHex(palabraSecreta));

  try {
    console.log(`\nCreando sesión con hash: ${hashPalabra} y duración: ${duracionEnDias} días...`);
    const createSessionTxHash = await profesorWalletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: abi,
      functionName: "crearSesion",
      args: [hashPalabra, BigInt(duracionEnDias)], // uint256 should be BigInt
      account: profesorWalletClient.account,
    });
    console.log("Transaction hash (crearSesion):", createSessionTxHash);
    const createSessionReceipt =
      await publicClient.waitForTransactionReceipt({
        hash: createSessionTxHash,
      });
    console.log(
      "Sesión creada:",
      createSessionReceipt.status === "success" ? "OK" : "Failed"
    );
    if (createSessionReceipt.status === "success") {
        // You can try to read the session details to confirm
        const sessionIdToQuery = 1; // Assuming this is the first session
        console.log(`Querying details for session ID: ${sessionIdToQuery}...`);
        const sessionDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: abi,
            functionName: "obtenerSesion",
            args: [BigInt(sessionIdToQuery)]
        });
        console.log("Detalles de la sesión creada:", {
            hash: sessionDetails[0],
            deadline: new Date(Number(sessionDetails[1]) * 1000).toLocaleString(), // Convert timestamp to readable date
            activa: sessionDetails[2]
        });
    } else {
      console.error("Failed to create session:", createSessionReceipt);
    }
  } catch (error) {
    console.error("Error creando sesión:", error);
  }
}

main().catch((error) => {
  console.error("Unhandled error in main:", error);
  process.exitCode = 1;
});