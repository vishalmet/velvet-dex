import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuArrowDownUp } from "react-icons/lu";
import Select from "./components/Modals/Select";
import axios from "axios";
import { ethers } from "ethers";
import { swapTokenMetaSolver } from "./integration"; 
import Erc20Abi from "./tokenabi.json";
import TradingAssets from "./components/TradingAssets";
import eth from './assets/eth.png';
import { 
  logTokenSelect, 
  logQuoteFetch, 
  logBalanceCheck, 
  logInsufficientBalance,
  logWalletError 
} from './firebase';

const BuyandSell = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null); // "sell" or "buy"
  const [selectedTokenSell, setSelectedTokenSell] = useState(null);
  const [selectedTokenBuy, setSelectedTokenBuy] = useState(null);
  const [sellBalance, setSellBalance] = useState("0.0");
  const [buyBalance, setBuyBalance] = useState("0.0");
  const [isConnected,setIsConnected] = useState(false)
  const [sellAmount, setSellAmount] = useState(""); // Value from sell input
  const [sellAmountWei, setSellAmountWei] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // Replace with dynamic wallet address
  const [bestQuote, setBestQuote] = useState(null); // To display best quote after API call
  const [outAmount, setOutAmount] = useState('');
  const [showTradeAsset, setShowTradeAsset] = useState(false)
  const [processing, setProcessing] = useState(false);
  const [transCancel, setTransCancel] = useState(false)
  const [success, setSuccess] = useState(false)
  const [quoteText, setQuoteText] = useState("Enter amount")
  const openModal = (type) => {
    setCurrentModal(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
  };

useEffect(() => {
  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      console.warn("MetaMask not installed");
      setIsConnected(false);
      logWalletError('wallet_check', 'MetaMask not installed');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
         setSelectedTokenSell({
           symbol: "ETH",
           address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH doesn't have a contract address
           decimals: 18,
           image: eth, // Provide a valid image path for ETH
         });
      } else {
        setIsConnected(false);
        logWalletError('wallet_check', 'No accounts found');
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error.message);
      setIsConnected(false);
      logWalletError('wallet_check', error.message);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setIsConnected(true);
      setWalletAddress(accounts[0]);
       setSelectedTokenSell({
         symbol: "ETH",
         address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH doesn't have a contract address
         decimals: 18,
         image: eth, // Provide a valid image path for ETH
       });
    } else {
      setIsConnected(false);
    }
  };

  checkWalletConnection();

  // Add the event listener for account changes
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }

  // Cleanup on component unmount
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
  };
}, []);

  const handleTokenSelect = (token) => {
    if (currentModal === "sell") {
      setSelectedTokenSell(token);
      logTokenSelect(token.address, token.symbol, 'sell');
    } else if (currentModal === "buy") {
      setSelectedTokenBuy(token);
      logTokenSelect(token.address, token.symbol, 'buy');
    }
    closeModal();
  };


  const fetchTokenBalance = async (token, setBalance) => {
    if (!token || !walletAddress || !window.ethereum) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      if (token.symbol === "ETH") {
        // Fetch ETH balance directly
        const balance = await provider.getBalance(walletAddress);
        const formattedBalance = ethers.utils.formatEther(balance); // ETH has 18 decimals
        setBalance(formattedBalance);
        logBalanceCheck(token.address, token.symbol, formattedBalance);
      } else {
        // Fetch ERC20 token balance
        const contract = new ethers.Contract(token.address, Erc20Abi, provider);
        const balance = await contract.balanceOf(walletAddress);
        const formattedBalance = ethers.utils.formatUnits(
          balance,
          token.decimals
        );
        setBalance(formattedBalance);
        logBalanceCheck(token.address, token.symbol, formattedBalance);
      }
    } catch (error) {
      console.error("Error fetching token balance:", error.message);
      setBalance("0.0");
      logWalletError('balance_fetch', error.message);
    }
  };


useEffect(() => {
  // Fetch balance for the selected sell token
  if (selectedTokenSell) {
    fetchTokenBalance(selectedTokenSell, setSellBalance);
  }
}, [selectedTokenSell, walletAddress]);

useEffect(() => {
  // Fetch balance for the selected buy token
  if (selectedTokenBuy) {
    fetchTokenBalance(selectedTokenBuy, setBuyBalance);
  }
}, [selectedTokenBuy, walletAddress]);



 const fetchBestQuote = async () => {
  const amountInWei = ethers.utils.parseUnits(
    sellAmount,
    selectedTokenSell?.decimals || 18
  );
  setSellAmountWei(amountInWei.toString());
  console.log(amountInWei.toString());
   if (!selectedTokenSell || !selectedTokenBuy || !sellAmount) {
     console.warn("Missing required fields to fetch the best quote.");
     return;
   }
 if (exceedsAllowedDecimals) {
    setOutAmount("-");
    setQuoteText("No suitable route found");
    logQuoteFetch(
      selectedTokenSell.address,
      selectedTokenBuy.address,
      sellAmount,
      false,
      'Exceeds allowed decimals'
    );
    return;
  }

  try {
    const amountInWei = ethers.utils.parseUnits(
      sellAmount,
      selectedTokenSell?.decimals || 18
    );

   const payload = {
     slippage: "10",
     amountIn: amountInWei.toString(),
     tokenIn: selectedTokenSell?.address,
     tokenOut: selectedTokenBuy?.address,
     fromAddress: walletAddress,
     receiver: walletAddress,
     routingStrategy: "router",
     feeReceiver: "0x2F31eAba480d133d3cC7326584B0C40eFacecaDB",
     chainId: 8453,
   };
   console.log(payload)
const authToken = import.meta.env.VITE_AUTH_KEY;
   
     const response = await axios.post(
       "https://api.enso.finance/api/v1/shortcuts/route",
       payload,
       {
         headers: {
           Authorization:  `Bearer ${authToken}`,
         },
       }
     );
     const rawAmountOut = response.data.amountOut;
    setQuoteText("Please wait")
     // Convert amountOut from wei to human-readable format
     const formattedAmountOut = ethers.utils.formatUnits(
       rawAmountOut,
       selectedTokenBuy?.decimals || 18 // Use token decimals or default to 18
     );

     setBestQuote(response.data);
     setQuoteText('')
     setOutAmount(formattedAmountOut); // Use the formatted value
     logQuoteFetch(
       selectedTokenSell.address,
       selectedTokenBuy.address,
       sellAmount,
       true
     );
   } catch (error) {
     setOutAmount('-')
     setQuoteText('No suitable route found')
     logQuoteFetch(
       selectedTokenSell.address,
       selectedTokenBuy.address,
       sellAmount,
       false,
       error.message
     );
     console.error(
       "Error fetching best quote:",
    
       error.response?.data || error.message
     );
   }
 };

  useEffect(() => {
  if (sellAmount > 0) { // Check if sellAmount is greater than 0
    fetchBestQuote();
  }
}, [sellAmount, selectedTokenSell, selectedTokenBuy]);

  const getDecimalPlaces = (value) => {
    if (!value.includes(".")) return 0;
    return value.split(".")[1].length;
  };

  const exceedsAllowedDecimals =
    sellAmount &&
    getDecimalPlaces(sellAmount) > (selectedTokenSell?.decimals || 0);

  const isInsufficientBalance =
    parseFloat(sellAmount) > parseFloat(sellBalance);

useEffect(() => {
  if (isInsufficientBalance && selectedTokenSell && sellAmount) {
    logInsufficientBalance(
      selectedTokenSell.address,
      selectedTokenSell.symbol,
      sellAmount,
      sellBalance
    );
  }
}, [isInsufficientBalance, selectedTokenSell, sellAmount, sellBalance]);

 const handleSwap = async () => {
   if (!window.ethereum) {
     console.error("MetaMask is not installed or enabled.");
     return;
   }

   // Set processing to true and reset other states
   setProcessing(true);
   setSuccess(false);
   setTransCancel(false);

   try {
     const provider = window.ethereum; // Initialize the provider
     const chainId = 8453; // Replace with your actual chain ID
     const slippage = "1"; // Example slippage

     if (!selectedTokenSell || !selectedTokenBuy || !sellAmount) {
       console.error("Please ensure all required fields are filled.");
       setProcessing(false); // Reset processing
       return;
     }

     const amountInWei = ethers.utils.parseUnits(
       sellAmount,
       selectedTokenSell?.decimals || 18
     );

     
     setShowTradeAsset(true);

     const receipt = await swapTokenMetaSolver(
       amountInWei.toString(),
       selectedTokenSell.address,
       selectedTokenBuy.address,
       slippage,
       provider,
       chainId,
       bestQuote // Make sure bestQuote is valid and populated
     );

     
     setProcessing(false);
     setSuccess(true); // Mark transaction as successful
      // Reset processing
     setSellAmount('')
     setOutAmount('0.0')
   } catch (error) {
     console.error("Error performing the swap:", error.message);
     setTransCancel(true); // Mark transaction as failed
     setProcessing(false)
     setSuccess(false)
   } 
 };

  const handleTradingAssetClose = () =>{
  setShowTradeAsset(false)
 }
const formatNumber = (num) => {
    // Convert number to string and split into integer and fractional parts
    const numStr = num.toString();
    const [integerPart, fractionalPart] = numStr.split(".");

    if (!fractionalPart) return numStr; // Return as-is if no fractional part

    // Count leading zeros in the fractional part
    const leadingZeros = fractionalPart.match(/^0*/)[0].length;

    // Limit the fractional part to three digits after the leading zeros
    const limitedFraction = fractionalPart.slice(
      leadingZeros,
      leadingZeros + 3
    );

    // Format the result with subscript for leading zeros
    return (
      <>
        {integerPart}.0
        <sub>{leadingZeros}</sub>
        {limitedFraction}
      </>
    );
  };;




  return (
    <div>
      <div className="bg-[#171628] w-full h-fit rounded-xl sm:rounded-[16px] px-1 sm:px-3  py-0.5 sm:py-1.5 ">
        <p className="text-[#6E6D7B] text-[12px] sm:text-[14px]">You sell</p>
        <div className="flex justify-between items-center">
          <input
            placeholder="0.0"
            value={sellAmount}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only numbers and a single dot
              if (/^\d*\.?\d*$/.test(value)) {
                setSellAmount(value);
              }
            }}
            className="w-full sm:w-56 bg-transparent outline-none text-white text-sm sm:text-xl font-medium"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => openModal("sell")}
            disabled={!isConnected}
            className="border  border-[#6E6D7B] hover:bg-[#6E6D7B]/20 sm:p-2 p-1 sm:px-4 flex text-xs sm:text-xl rounded-full items-center "
          >
            {selectedTokenSell ? (
              <div className="flex gap-0.5 sm:gap-2 text-[9px] sm:text-sm items-center">
                <img
                  src={selectedTokenSell.image}
                  alt=""
                  className="sm:h-4 sm:w-4 h-3 w-3 rounded-full"
                />
                {selectedTokenSell.symbol}
              </div>
            ) : (
              <p className="sm:text-base text-[8px]">Select token</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="sm:size-4 size-3 ml-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.button>
        </div>
        {isModalOpen && currentModal === "sell" && (
          <Select closeModal={closeModal} onTokenSelect={handleTokenSelect} />
        )}
        <div className="flex justify-between ">
          <button
            className="bg-[#ffffff14]  text-xs sm:text-base  rounded-md border-[1px] border-[#ffffff4f]"
            onClick={() => setSellAmount(sellBalance)}
          >
            Max
          </button>
          <p className="text-[10px] sm:text-xs text-[#6E6D7B] pt-0.5 sm:pt-1 font-medium text-right">
            Balance: {sellBalance && formatNumber(sellBalance)}{" "}
            {selectedTokenSell?.symbol}
          </p>
        </div>
      </div>

      <motion.div
        whileTap={{ scale: 0.9 }}
        className="bg-[#171628] px-1 sm:px-2 sm:py-1 py-0.5 w-fit mx-auto"
      >
        <LuArrowDownUp className="text-white text-[10px] sm:text-xl" />
      </motion.div>

      <div className="bg-[#171628] w-full h-fit rounded-xl sm:rounded-[16px] px-1 sm:px-3  py-0.5 sm:py-1.5">
        <p className="text-[#6E6D7B] text-[12px] sm:text-[14px]">You buy</p>
        <div className="flex justify-between items-center">
          <input
            value={sellAmount > 0 ? outAmount : "0.0"}
            placeholder="0.0"
            readOnly
            className="w-full sm:w-56 bg-transparent outline-none text-white text-sm sm:text-xl font-medium"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => openModal("buy")}
            className="border border-[#6E6D7B] hover:bg-[#6E6D7B]/20 sm:p-2 p-1 sm:px-4 flex sm:text-sm rounded-full items-center"
          >
            {selectedTokenBuy ? (
              <div className="flex gap-0.5 sm:gap-2 text-[10px] sm:text-sm items-center">
                <img
                  src={selectedTokenBuy.image}
                  alt=""
                  className="sm:h-4 sm:w-4 h-3 w-3 rounded-full"
                />
                {selectedTokenBuy.symbol}
              </div>
            ) : (
              <p className="sm:text-base text-[8px]">Select token</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="sm:size-4 size-3 ml-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.button>
        </div>
        {isModalOpen && currentModal === "buy" && (
          <Select closeModal={closeModal} onTokenSelect={handleTokenSelect} />
        )}
        <p className="text-[10px] sm:text-xs text-[#6E6D7B] pt-0.5 sm:pt-1 font-medium text-right">
          Balance: {buyBalance && formatNumber(buyBalance)}{" "}
          {selectedTokenBuy?.symbol}
        </p>
      </div>
      <div className="mt-1">
        {!isConnected && (
          <button
            disabled
            className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
          >
            Connect Wallet
          </button>
        )}

        {isConnected &&
          (!selectedTokenBuy ||
            selectedTokenBuy?.address === selectedTokenSell?.address) && (
            <button
              disabled
              className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
            >
              Select Asset
            </button>
          )}

        {isConnected &&
          selectedTokenBuy &&
          selectedTokenBuy.address !== selectedTokenSell?.address &&
          (sellAmount <= 0 || sellAmount === "") && (
            <button
              disabled
              className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
            >
              Enter Amount
            </button>
          )}

        {isConnected && selectedTokenBuy && sellAmount && processing && (
          <button
            className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
            disabled
          >
            Please Wait
          </button>
        )}

        {isConnected &&
          selectedTokenBuy &&
          sellAmount > 0 &&
          selectedTokenBuy?.address !== selectedTokenSell?.address &&
          (exceedsAllowedDecimals ||
            quoteText === "No suitable route found") && (
            <button
              className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
              disabled
            >
              {isInsufficientBalance
                ? "Insufficient balance"
                : " No Suitable Route Found"}
            </button>
          )}

        {isConnected &&
          selectedTokenBuy &&
          sellAmount &&
          outAmount !== "-" &&
          selectedTokenBuy?.address !== selectedTokenSell?.address &&
          isInsufficientBalance && (
            <button
              className="mt-1 sm:mt-3 bg-[#7000ff]/70 hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 text-xs sm:text-base sm:p-2 text-center text-[#ffffffba]"
              disabled
            >
              Insufficient balance
            </button>
          )}

        {isConnected &&
          selectedTokenBuy &&
          sellAmount > 0 &&
          quoteText !== "No suitable route found" &&
          outAmount &&
          !exceedsAllowedDecimals &&
          !isInsufficientBalance && (
            <button
              className="mt-1 sm:mt-3 bg-[#7000ff] hover:bg-[#7000ff]/70 font-semibold w-full rounded-[40px] p-1 sm:p-2 text-xs sm:text-base text-center cursor-pointer"
              onClick={handleSwap}
            >
              Trade
            </button>
          )}
      </div>

      {showTradeAsset && (
        <TradingAssets
          handleTradingAssetClose={handleTradingAssetClose}
          processing={processing}
          success={success}
          transCancel={transCancel}
        />
      )}
    </div>
  );
};

export default BuyandSell;
