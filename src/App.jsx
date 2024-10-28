import React, { useState, useEffect } from 'react';
import CustomButton from './components/Wallet';
import CardHead from './components/CardHead';
import BuyandSell from './BuyandSell';
import axios from 'axios';


const App = () => {
  // State variables for loading, error, and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [tokenInfo, setTokenInfo] = useState(null);

  // Function to fetch token information
  const getTokens = async () => {
    try {
      const response = await axios.get('https://api.portals.fi/v2/tokens?networks=bsc', {
        headers: { 'Authorization': 'Bearer 31d0857c-0350-4a8f-b5b7-41e388c8e10e' },
        // params: {
        //   search: 'frax',
        //   platforms: 'curve',
        //   networks: 'base',
        //   sortBy: 'liquidity',
        //   sortDirection: 'desc'
        // }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  // Trigger fetchTokenInfo on component mount
  useEffect(() => {
    getTokens();
  }, []);

  return (
    <div className='bg-[#171628] min-h-screen inter-font text-white'>
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <p className='text-center text-white text-3xl font-semibold pb-3'>
            All DeFi at your fingertips
          </p>
          <CustomButton />
          <div className="bg-custom-bg bg-cover bg-center w-[455px] space-y-3 rounded-b-[32px] p-4">
            <CardHead />
            <BuyandSell />
          </div>

          {/* Display loading, error, or token info */}
        
        </div>
      </div>
    </div>
  );
};

export default App;
