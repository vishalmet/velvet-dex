import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDyzIuow1wVwnysfY2WHGUeBhKBGDXVZuc",
  authDomain: "ultimate-analytics-9d0be.firebaseapp.com",
  projectId: "ultimate-analytics-9d0be",
  storageBucket: "ultimate-analytics-9d0be.firebasestorage.app",
  messagingSenderId: "108249184507",
  appId: "1:108249184507:web:d4653164cec30c6fecd85e",
  measurementId: "G-85NGN7TB3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// App identifier for analytics
const APP_ID = 'velvet-dex';

// Custom analytics events
export const logSwapInitiated = (sellToken, buyToken, amount) => {
  logEvent(analytics, 'swap_initiated', {
    app_id: APP_ID,
    sell_token_address: sellToken,
    buy_token_address: buyToken,
    amount: amount,
    timestamp: new Date().toISOString()
  });
};

export const logSwapSuccess = (sellToken, buyToken, amount, txHash) => {
  logEvent(analytics, 'swap_success', {
    app_id: APP_ID,
    sell_token_address: sellToken,
    buy_token_address: buyToken,
    amount: amount,
    transaction_hash: txHash,
    timestamp: new Date().toISOString()
  });
};

export const logSwapError = (sellToken, buyToken, amount, error) => {
  logEvent(analytics, 'swap_error', {
    app_id: APP_ID,
    sell_token_address: sellToken,
    buy_token_address: buyToken,
    amount: amount,
    error_message: error.message || 'Unknown error',
    timestamp: new Date().toISOString()
  });
};

export const logWalletConnected = (address, chainId) => {
  logEvent(analytics, 'wallet_connected', {
    app_id: APP_ID,
    wallet_address: address,
    chain_id: chainId,
    timestamp: new Date().toISOString()
  });
};

// New analytics events
export const logTokenSelect = (tokenAddress, tokenSymbol, type) => {
  logEvent(analytics, 'token_select', {
    app_id: APP_ID,
    token_address: tokenAddress,
    token_symbol: tokenSymbol,
    selection_type: type, // 'buy' or 'sell'
    timestamp: new Date().toISOString()
  });
};

export const logQuoteFetch = (sellToken, buyToken, amount, success, errorMessage = null) => {
  logEvent(analytics, 'quote_fetch', {
    app_id: APP_ID,
    sell_token_address: sellToken,
    buy_token_address: buyToken,
    amount: amount,
    success: success,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  });
};

export const logBalanceCheck = (tokenAddress, tokenSymbol, balance) => {
  logEvent(analytics, 'balance_check', {
    app_id: APP_ID,
    token_address: tokenAddress,
    token_symbol: tokenSymbol,
    balance: balance,
    timestamp: new Date().toISOString()
  });
};

export const logInsufficientBalance = (tokenAddress, tokenSymbol, attemptedAmount, actualBalance) => {
  logEvent(analytics, 'insufficient_balance', {
    app_id: APP_ID,
    token_address: tokenAddress,
    token_symbol: tokenSymbol,
    attempted_amount: attemptedAmount,
    actual_balance: actualBalance,
    timestamp: new Date().toISOString()
  });
};

export const logWalletError = (errorType, errorMessage) => {
  logEvent(analytics, 'wallet_error', {
    app_id: APP_ID,
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  });
};

export { analytics };
