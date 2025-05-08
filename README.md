# Attendance DApp with ERC20
## Usage Flow

### For the Teacher (flow allow only on backend)

1.  Access the admin/teacher section of the DApp.
2.  Connect their wallet (ensure it's the account with permissions to manage sessions, if applicable).
3.  Navigate to the "Create Session" option.
4.  Enter the session details:
    *   Session name or description.
    *   A unique **secret word**.
    *   The **duration** in days during which students can mark attendance.
5.  Submit the transaction to create the session on the blockchain.

### For the Student (flow on the DApp)

1.  Access the DApp.
2.  Connect their wallet (e.g., MetaMask).
3.  View the list of "Open Sessions."
4.  Select the session for which they want to mark attendance.
5.  Enter the **secret word** provided by the teacher for that session.
6.  Click "Claim Attendance" or "Mark Present."
7.  Confirm the transaction in their wallet to mint/claim the attendance token.
8.  (Optional) They can view their attendance tokens in their profile or wallet (if the token is a visible NFT).

## Deployment

*   **Backend:** Smart contracts are deployed to an Ethereum network (or EVM-compatible) like Sepolia (testnet) or Mainnet.
*   **Frontend:** The Next.js application can be deployed on platforms like Vercel, Netlify, AWS Amplify, etc. Ensure you configure the environment variables correctly on the deployment platform.

## Prerequisites

*   Node.js
*   npm or yarn
*   Git
*   A browser wallet like MetaMask

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Backend (Smart Contracts)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the `backend/` directory based on `.env.example` (if it exists) or with the following variables:
    ```env
    # backend/.env
    PRIVATE_KEY=YOUR_PRIVATE_KEY_FOR_DEPLOYMENT_AND_LOCAL_TESTS
    RPC_URL_SEPOLIA=YOUR_ALCHEMY_OR_INFURA_RPC_URL_FOR_SEPOLIA # Or the network you use
    ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY # Optional, for verification
    ```
    *   `PRIVATE_KEY`: The private key of the account you will use to deploy contracts (on a local test network like Hardhat Network, you can use the ones provided by Hardhat).
    *   `RPC_URL_SEPOLIA`: RPC node URL for the test network (e.g., Sepolia, Goerli) if you plan to deploy there.
    *   `ETHERSCAN_API_KEY`: For verifying contracts on Etherscan (optional).

4.  **Compile the contracts:**
    ```bash
    npx hardhat compile
    ```

5.  **Run a local Hardhat node (for development):**
    ```bash
    npx hardhat node
    ```
    This will start a local blockchain at `http://127.0.0.1:8545/`. Note down some of the test accounts it displays.

6.  **Deploy the contracts (in a new terminal, while the node is still running):**
    Ensure your deployment script (`scripts/deploy.ts` or similar) is configured.
    ```bash
    npx hardhat run scripts/deploy.ts --network localhost
    ```
    If deploying to a testnet like Sepolia:
    ```bash
    npx hardhat run scripts/deploy.ts --network sepolia
    ```
    **Important:** Note down the deployed contract address. You will need it for the frontend.

### 2. Frontend (Next.js Application)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    # or from the root: cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the `frontend/` directory with the following variables:
    ```env
    # frontend/.env.local
    NEXT_PUBLIC_PRIVY_APP_ID=YOUR_PRIVY_APP_ID
    NEXT_PUBLIC_CONTRACT_ADDRESS=DEPLOYED_CONTRACT_ADDRESS
    NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545 # For local Hardhat, or your Sepolia/etc. RPC
    NEXT_PUBLIC_CHAIN_ID=31337 # For local Hardhat (11155111 for Sepolia)
    ```
    *   `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy.io App ID.
    *   `NEXT_PUBLIC_CONTRACT_ADDRESS`: The address of the smart contract you deployed in the previous step.
    *   `NEXT_PUBLIC_RPC_URL`: The RPC node URL the frontend will connect to. For local development, use the Hardhat Network URL.
    *   `NEXT_PUBLIC_CHAIN_ID`: The chain ID.

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:3000`.


 