import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { TbInfoCircle } from "react-icons/tb";
import { FiAlertTriangle } from "react-icons/fi";
import base from '../assets/base.svg'
import bnb from "../assets/bnb.svg";

const CardHead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isConnected, setIsConnected] = useState(false); 
  const [userAddress, setUserAddress] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [displayValue, setDisplayValue] = useState("1%"); // Default value for the button
  const [tokenInfo, setTokenInfo] = useState(null);
  const [network, setNetwork] = useState(null); // State to store the current network

  const BASE_NETWORK_ID = "8453"; // Example network ID for Base
  const BNB_NETWORK_ID = "56"; // Example network ID for BNB

  // Check the current network
  const checkNetwork = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork(network.chainId.toString());
    }
  }; const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setIsConnected(true);
        setUserAddress(accounts[0]); // Set the user's address if connected
      } else {
        setIsConnected(false);
        setUserAddress(""); // Clear the address if not connected
      }
    }
  };


  // Switch to a specified network
  const switchNetwork = async (networkId) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(parseInt(networkId)) }],
        });
      } catch (switchError) {
        console.error("Failed to switch network:", switchError);
      }
    }
  };
useEffect(() => {
  // Initial check for network and connection
  checkNetwork();
  checkConnection();

  const handleChainChanged = (chainId) => {
    setNetwork(parseInt(chainId, 16).toString()); // Update network state immediately
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setIsConnected(true);
      setUserAddress(accounts[0]);
    } else {
      setIsConnected(false);
      setUserAddress("");
    }
  };

  if (window.ethereum) {
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged); // Listen for account changes
  }

  // Cleanup the event listeners when the component unmounts
  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged); // Remove account change listener
    }
  };
}, []);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const options = ["0.25%", "0.5%", "0.75%", "1%", "Custom"];

  const handleSelect = (option) => {
    setSelected(option);
    setCustomValue(""); // Reset custom value if switching options
    setShowWarning(false); // Reset warning
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomValue(value);

    // Check if the value entered is greater than 5
    if (value > 5) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSaveSettings = () => {
    if (selected === "Custom" && customValue) {
      setDisplayValue(`${customValue}%`);
    } else {
      setDisplayValue(selected);
    }
    closeModal();
  };

  return (
    <div className="flex justify-between items-center">
      <p className="text-2xl font-semibold">Trade</p>
      {/* Network switch button logic */}
      

      <motion.div className="flex items-center gap-4">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 text-[#A987F4]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </motion.svg>
        <div className="">
          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="hover:bg-[#A987F4]/10 rounded-[16px] p-1 px-2 gap-3 flex items-center"
            onClick={openModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            {displayValue}
          </motion.button>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
              <div className="bg-[#171628] w-[465px] h-fit rounded-[16px] p-5 shadow-lg space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Slippage Settings</h2>
                  <IoClose
                    className="size-6 cursor-pointer"
                    onClick={closeModal}
                  />
                </div>
                <div className="border border-[#6E6D7B] rounded-[40px] w-full flex justify-evenly p-1">
                  {options.map((option, index) => (
                    <p
                      key={index}
                      className={`px-5 p-2 rounded-[40px] text-sm cursor-pointer transition-colors duration-300 ${
                        selected === option
                          ? "bg-[#7000FF] text-white"
                          : "text-[#6E6D7B] hover:text-[#6E6D7B]/50"
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </p>
                  ))}
                </div>

                {selected === "Custom" && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 border border-[#6E6D7B] bg-white/5 rounded-[16px] w-full px-2">
                      <input
                        type="number"
                        id="customPercentage"
                        className="bg-transparent focus:outline-none rounded-lg p-2 w-full"
                        value={customValue}
                        onChange={handleCustomInputChange}
                        placeholder="0"
                        min="1"
                        max="50"
                      />
                      <p>%</p>
                    </div>
                    <label
                      htmlFor="customPercentage"
                      className="flex items-center gap-1 text-white text-xs"
                    >
                      <TbInfoCircle className="size-4 text-[#7000FF]" />
                      Enter slippage value between 0% - 50%
                    </label>

                    {/* Show warning if custom input is greater than 5 */}
                    {showWarning && (
                      <p className="text-white text-xs flex gap-1">
                        <FiAlertTriangle className="size-4 text-orange-500" />
                        Entered slippage may cause frontrun and result in an
                        unfavorable transaction.
                      </p>
                    )}
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="bg-[#7000ff] hover:bg-[#7000ff]/70 w-full rounded-[40px] p-2 text-center"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CardHead;
