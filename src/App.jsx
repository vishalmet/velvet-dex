import React, { useState, useEffect } from 'react';
import CustomButton from './components/Wallet';
import CardHead from './components/CardHead';
import BuyandSell from './BuyandSell';

const App = () => {
  // State variables for loading, error, and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  // Function to fetch token information
  const fetchTokenInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/0x4c88795dfcbe67ea0781357c49055c3bf6181826/erc20?chain=0x38&exclude_spam=true`);
      const data = await res.json();
      setTokenInfo(data); // Store the token info in state
      console.log(data, "token info");
    } catch (error) {
      setError('Failed to fetch token information');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchTokenInfo on component mount
  useEffect(() => {
    fetchTokenInfo();
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
          {loading && <p>Loading...</p>}
          {error && <p className='text-red-500'>{error}</p>}
          {tokenInfo && (
            <div>
              <p>Token Data:</p>
              <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
