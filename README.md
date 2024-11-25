# Velvet DEX

A decentralized exchange built on Base network with Firebase analytics integration.

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in the required environment variables:

```env
# Required API Keys
VITE_API_KEY=            # API key for the DEX service
VITE_AUTH_KEY=           # authentication key

# Firebase Configuration
VITE_FIREBASE_API_KEY=   # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Token swapping on Base network
- Real-time price quotes
- Comprehensive analytics tracking
- Wallet integration
- Balance checking for tokens

## Analytics Events

The application tracks various events using Firebase Analytics:

- Swap operations (initiation, success, failure)
- Token selection
- Quote fetching
- Balance checks
- Wallet connections

For more details about analytics implementation, check the [Analytics Documentation](./docs/analytics.md).

## Security Notes

- Never commit the `.env` file to version control
- Keep your API keys and Firebase configuration secure
- Use environment variables for all sensitive information

## Technical Stack

- React + Vite
- Web3.js & Ethers.js
- Firebase Analytics
- TailwindCSS
- Framer Motion