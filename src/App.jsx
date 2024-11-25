import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CustomButton from "./components/Wallet";
import CardHead from "./components/CardHead";
import BuyandSell from "./BuyandSell";
import axios from "axios";
import TradingAssets from "./components/TradingAssets";
import velvetlogo from '../src/assets/velvetlogo.svg';
import velvetheadlogo from '../src/assets/velvetheadlogo.png'
import baselogo from '../src/assets/baselogo.png'

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
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <div className="flex items-center gap-4  mx-auto justify-center mb-2 bg-[#fff] w-fit p-2 rounded-lg">
            <img src={velvetheadlogo} alt="" className="h-10 w-40" />
            <p className="text-3xl text-black">x</p>
            <img src={baselogo} alt="" className="h-7 w-24" />
          </div>
          <CustomButton />
          <div className="bg-custom-bg bg-cover bg-center w-[455px] space-y-1 rounded-b-[32px] px-4 py-2">
            <CardHead />
            <BuyandSell />
          </div>
          <p className=" text-base font-semibold text-center leading-5    sm:pt-2 ">
            Powered by Winks.fun
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
