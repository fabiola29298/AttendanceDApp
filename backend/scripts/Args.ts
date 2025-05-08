import { Address, encodeAbiParameters, parseAbiParameters } from 'viem';

const constructorParams = parseAbiParameters('string memory name, string memory symbol, address initialOwner');
import * as dotenv from "dotenv";
dotenv.config();
// --- CONFIGURATION ---
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as Address || ""; 

const encodedArgs = encodeAbiParameters(
  constructorParams,
  ["AsistenciaToken", "AST", CONTRACT_ADDRESS]
);
console.log("ABI-encoded constructor arguments:", encodedArgs);
// This will output something like 0x0000...
// The block explorer usually wants the part *without* the leading 0x.