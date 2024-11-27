import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CustomButton from "./components/Wallet";
import CardHead from "./components/CardHead";
import BuyandSell from "./BuyandSell";
import axios from "axios";
import TradingAssets from "./components/TradingAssets";
import velvetlogo from '../src/assets/velvetlogo.svg';
import velvetheadlogo from '../src/assets/VelvetCapitalLight.svg'
import header from '../src/assets/header.png'

const App = () => {
  


  // Function to fetch token information
  const getTokens = async () => {
    try {
      const response = await axios.get(
        "https://api.velvet.capital/api/v3/token",
        {
          headers: {
            Authorization: "Bearer 31d0857c-0350-4a8f-b5b7-41e388c8e10e",
          },
        }
      );
      console.log(response.data);
      setTokenInfo(response.data);
    } catch (error) {
      console.error("Error:", error);
      setError(error);
    }
  };


  return (
    <div className="bg-black min-h-screen inter-font text-white">
      <div className="flex justify-center items-center min-h-screen p-1 sm:m-0">
        <div>
          <div className="flex items-center gap-4  mx-auto justify-center mb-1 sm:mb-2 w-fit p-0.5 px-1 sm:p-1 rounded-lg">
            <img
              src={header}
              alt=""
              className="w-[300px] h-[42px] sm:w-[455px] sm:h-[64px]"
            />
          </div>
          <CustomButton />
          <div className="bg-custom-bg bg-cover bg-center w-full sm:w-[455px] space-y-0.5 sm:space-y-1 rounded-b-[20px] sm:rounded-b-[32px] px-2 sm:px-4 py-1 sm:py-2 sm:pb-[16px]">
            <CardHead />
            <BuyandSell />
          </div>
          <p className="text-[10px] sm:text-base font-semibold text-center leading-5 pt-0.5   sm:pt-2 ">
            Powered by Winks.fun
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
