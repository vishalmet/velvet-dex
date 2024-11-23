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
      

      
    </div>
  );
};

export default CardHead;
