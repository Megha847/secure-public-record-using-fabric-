# Secure Public Record Management & Verification System

Enterprise full-stack application for managing and verifying government/public records with MongoDB metadata storage and Hyperledger Fabric-backed record hashes.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide icons
- Backend: Node.js, Express.js, MongoDB, JWT, bcrypt, Multer
- Blockchain: Hyperledger Fabric chaincode and a backend gateway adapter
- DevOps: Docker Compose

## Quick Start

1. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Start MongoDB and the API:

```bash
docker compose up --build
```

3. Start the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

4. Open the app at `http://localhost:5173`.

## Default Development Users

Seed users are created when `SEED_DEMO_USERS=true`:

- Admin: `admin@secure-records.gov` / `Admin@12345`
- Government Officer: `officer@secure-records.gov` / `Officer@12345`
- Verifier: `verifier@secure-records.gov` / `Verifier@12345`

## Hyperledger Fabric

The backend uses `backend/src/services/blockchain.service.js`.

- Set `FABRIC_ENABLED=true` to submit and query hashes through Fabric Gateway.
- Keep `FABRIC_ENABLED=false` for local development without a Fabric network.
- The app still persists blockchain transaction summaries in MongoDB for dashboard and explorer views.
- Chaincode is included in `chaincode/record-contract`.

### Real Fabric Network Setup

After starting `fabric-samples/test-network`, creating `mychannel`, and deploying the chaincode as `public-records`, run the backend from WSL so it can read the Fabric certificates:

```bash
cd /mnt/c/Users/user/OneDrive/Desktop/MP2/backend
cp .env.example .env
```

Set these values in `backend/.env`:

```bash
FABRIC_ENABLED=true
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=public-records
FABRIC_MSP_ID=Org1MSP
FABRIC_PEER_ENDPOINT=localhost:7051
FABRIC_PEER_HOST_ALIAS=peer0.org1.example.com
FABRIC_TLS_CERT_PATH=/home/megha/fabric-workspace/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
FABRIC_CERT_PATH=/home/megha/fabric-workspace/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem
FABRIC_KEY_DIRECTORY=/home/megha/fabric-workspace/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore
```

Then start MongoDB and the backend:

```bash
docker run -d --name secure-records-mongo -p 27017:27017 mongo:7
npm install
npm run dev
```

## Security Modes

Every uploaded PDF receives a SHA-256 hash. The selected security mode is stored with the blockchain transaction:

- Traditional: plain file hashing
- AES: records intent to use AES-encrypted storage
- AES + ZKP: records intent for AES encryption plus proof-based verification

Production deployments should connect these modes to a managed KMS, encrypted object storage, and a real ZKP circuit/prover.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `POST /api/records`
- `POST /api/upload`
- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/verify`
- `GET /api/performance`
- `GET /api/explorer`

## QR Code Verification

After a successful upload, the frontend generates a QR code containing:

```text
http://<app-host>/verify/<recordId>
```

The QR can be downloaded as a PNG and printed or attached to a certificate. Scanning the QR opens a public verification page that fetches record metadata and lets the verifier optionally upload a file for SHA-256 comparison.

### Android Phone Demo

1. Connect laptop and Android phone to the same Wi-Fi.
2. Find the laptop IPv4 address:

```powershell
ipconfig
```

3. Start backend:

```powershell
cd backend
npm run dev
```

4. Start frontend:

```powershell
cd frontend
npm run dev
```

5. Open the app on Android Chrome using the laptop IP:

```text
http://<laptop-ip>:5173
```

6. Upload a record from the laptop or phone. The QR URL will use the same host from which the app is opened.
7. On Android, open:

```text
http://<laptop-ip>:5173/scanner
```

8. Allow camera permission and scan the generated QR code.

The app also includes a web manifest, so Android Chrome can install it from "Add to Home screen" for an app-like demo.
