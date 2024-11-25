import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import axios from 'axios';
import Erc20Abi from "../../tokenabi.json";
import { ethers } from "ethers";
import eth from '../../assets/eth.png'

const Select = ({ closeModal, onTokenSelect }) => {
  const [assets, setAssets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);
  const [selectionProtocol, setSelectionProtocol] = useState("All Protocols");
  const [selectionSort, setSelectionSort] = useState("Default");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [walletAddress, setWalletAddress] = useState(""); // Replace with dynamic wallet address
  const [tokenBalances, setTokenBalances] = useState({});
  const [bsctokens, setBsctokens] = useState();
  const [basetokens, setBasetokens] = useState();

  const PORTALS_PLATFORMS = {
    base: [
      "native",
      "basic",
      "morpho",
      "baseswap",
      "rocketswap",
      "swapbased",
      "synthswap",
      "beefy",
      "balancerv2",
      "balancerv2boosted",
      "thegranary",
      "alienbase",
      "soswap",
      "moonwell",
      "stargate",
      "curve",
      "aerodrome",
      "sonne-finance",
      "seamless-protocol",
      "aavev3",
      "equalizer",
      "compound-v3",
      "hop-protocol",
      "hop-protocol-tokens",
      "harvest-finance",
      "pooltogether-v5",
      "uniswapv2",
      "fluid",
      "overnight-finance",
    ],
  };
  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      console.warn("MetaMask not installed");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        console.warn("No wallet connected");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  
 const fetchTokenBalance = async (token) => {
   if (!walletAddress || !window.ethereum) {
     console.error("Missing wallet address or Ethereum provider");
     return "0";
   }

   try {
     const provider = new ethers.providers.Web3Provider(window.ethereum);

     if (token.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
       // Handle native ETH balance
       const balance = await provider.getBalance(walletAddress);
       const formattedBalance = ethers.utils.formatEther(balance);

       setTokenBalances((prev) => ({
         ...prev,
         [token.address]: formattedBalance,
       }));

       return formattedBalance;
     } else {
       // Handle ERC20 token balance
       const contract = new ethers.Contract(token.address, Erc20Abi, provider);
       const balance = await contract.balanceOf(walletAddress);
       const formattedBalance = ethers.utils.formatUnits(
         balance,
         token.decimals || 18
       );

       setTokenBalances((prev) => ({
         ...prev,
         [token.address]: formattedBalance,
       }));

       return formattedBalance;
     }
   } catch (error) {
     console.error("Error fetching token balance:", error.message);
     return "0";
   }
 };


  useEffect(() => {
    if (assets.length > 0 && walletAddress) {
      // Fetch balances for all tokens
      assets.forEach((token) => {
        fetchTokenBalance(token);
      });
    }
  }, [assets, walletAddress]);

useEffect(() => {
  // Sort tokens whenever tokenBalances is updated
  const sortedAssets = [...assets].sort((a, b) => {
    const balanceA = parseFloat(tokenBalances[a.address] || "0");
    const balanceB = parseFloat(tokenBalances[b.address] || "0");
    return balanceB - balanceA; // Descending order of balances
  });

  setFilteredAssets(
    sortedAssets.filter((token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}, [tokenBalances, searchTerm, assets]);


  const handleTokenClick = (token) => {
    onTokenSelect(token); // Pass the selected token back to the parent
    closeModal();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdownSort = () => {
    setIsOpenSort(!isOpenSort);
  };



  const targetAddresses = [
    "0x5efc4446e1d772428adbd6053a0421ca7b3ed85a",
    "0x4200000000000000000000000000000000000006",
    "0x1fe265db428ec5dbcd69e4aecfc47791a4e5f0bd",
    "0xf5a5a87911a8260898916f61a965caea507ccf24",
    "0x82a843b831532f97c7381deb921513d00b7123fe",
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "0x3613545064ffe8b12e6136c2e8fbaa569779a341",
    "0x656a19ddb4f2637c61223a2ce125681c50269f59",
    "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
    "0x1244264aec147f26b056d00d265eea0bc46db83c",
    "0x33e0cacd0ff1d506a489c8da2f72ccc5ddf641fc",
    "0x15385c9281bc12d2e9bf5c081621944b0ee2acca",
    "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    "0x236aa50979d5f3de3bd1eeb40e81137f22ab794b",
    "0x9eaf8c1e34f05a589eda6bafdf391cf6ad3cb239",
    "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452",
    "0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c",
    "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
    "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "0x13f4196cc779275888440b3000ae533bbbbc3166",
    "0xdc46c1e93b71ff9209a0f8076a9951569dc35855",
    "0xe8e286b378254c4913c0c6964361636384b9d018",
    "0x37ab9f42051c112caaba55ab6487dd74286a0b29",
    "0xdcf5130274753c8050ab061b1a1dcbf583f5bfd0",
    "0xde5ed76e7c05ec5e4572cfc88d1acea165109e44",
    "0x7431ada8a591c955a994a21710752ef9b882b8e3",
    "0xa3d1a8deb97b111454b294e2324efad13a9d8396",
    "0x489fe42c267fe0366b16b0c39e7aeef977e841ef",
    "0x6e51b3a19f114013e5dc09d0477a536c7e4e0207",
    "0x96419929d7949d6a801a6909c145c8eef6a40431",
    "0xfa980ced6895ac314e7de34ef1bfae90a5add21b",
    "0x614577036f0a024dbc1c88ba616b394dd65d105a",
    "0x6985884c4392d348587b19cb9eaaf157f13271cd",
    "0x3992b27da26848c2b19cea6fd25ad5568b68ab98",
    "0x5babfc2f240bc5de90eb7e19d789412db1dec402",
    "0x4158734d47fc9692176b5085e0f52ee0da5d47f1",
    "0xbb22ff867f8ca3d5f2251b4084f6ec86d4666e14",
    "0xff0c532fdb8cd566ae169c1cb157ff2bdc83e105",
    "0x3b9728bd65ca2c11a817ce39a6e91808cceef6fd",
    "0xdcefd8c8fcc492630b943abcab3429f12ea9fea2",
    "0x57f5fbd3de65dfc0bd3630f732969e5fb97e6d37",
    "0x8f2e6758c4d6570344bd5007dec6301cd57590a0",
    "0x18dd5b087bca9920562aff7a0199b96b9230438b",
    "0x24fcfc492c1393274b6bcd568ac9e225bec93584",
    "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
    "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
    "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
    "0x59d9356e565ab3a36dd77763fc0d87feaf85508c",
    "0x890a40bfae3bf25a5e7c50a31505774ee7a5d33b",
    "0xcfa3ef56d303ae4faaba0592388f19d7c3399fb4",
    "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
    "0xeb466342c4d449bc9f53a865d5cb90586f405215",
    "0x417ac0e078398c154edfadd9ef675d30be60af93",
    "0x1c7a460413dd4e964f96d8dfc56e7223ce88cd85",
    "0xbf1aea8670d2528e08334083616dd9c5f3b087ae",
    "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca",
    "0xf2393eeadd67bf68a60f39992113775966f34e1e",
    "0x4621b7a9c75199271f773ebd9a499dbd165c3191",
    "0xf395680803b269b62702554723e05b373171b07b",
    "0x47b464edb8dc9bc67b5cd4c9310bb87b773845bd",
    "0xcde172dc5ffc46d228838446c57c1227e0b82049",
    "0xe2c86869216ac578bd62a4b8313770d9ee359a05",
    "0x703d57164ca270b0b330a87fd159cfef1490c0a5",
    "0x8b52f46a52d86c131222ee14167da6a847bdb84a",
    "0x1b6a569dd61edce3c383f6d565e2f79ec3a12980",
    "0x9a26f5433671751c3276a065f57e5a02d2817973",
    "0x60d01ec2d5e98ac51c8b4cf84dfcce98d527c747",
    "0x8d3419b9a18651f3926a205ee0b1acea1e7192de",
    "0x6a4f69da1e2fb2a9b11d1aad60d03163fe567732",
    "0xab36452dbac151be02b16ca17d8919826072f64a",
    "0x4dd9077269dd08899f2a9e73507125962b5bc87f",
    "0x8972ab69d499b5537a31576725f0af8f67203d38",
    "0xafb89a09d82fbde58f18ac6437b3fc81724e4df6",
    "0x858c50c3af1913b0e849afdb74617388a1a5340d",
    "0xe2dca969624795985f2f083bcd0b674337ba130a",
    "0x081ad949defe648774c3b8debe0e4f28a80716dc",
    "0x63228048121877a9e0f52020834a135074e8207c",
    "0xe642657e4f43e6dcf0bd73ef24008394574dee28",
    "0xacd1caef47e4c47bafe8a51b3f4305fc38203b7a",
    "0x0028e1e60167b48a938b785aa5292917e7eaca8b",
    "0xcde90558fc317c69580deeaf3efc509428df9080",
    "0x1f1aa4d239002bb818536c95e9b762a1fc8484c1",
    "0x7a8a5012022bccbf3ea4b03cd2bb5583d915fb1a",
    "0x949185d3be66775ea648f4a306740ea9eff9c567",
    "0x4e719699e4197f4bf4370c49acd3e3b8de11974f",
    "0x0002bcdaf53f4889bf2f43a3252d7c03fe1b80bc",
    "0x9f95e17b2668afe01f8fbd157068b0a4405cc08d",
    "0x511ef9ad5e645e533d15df605b4628e3d0d0ff53",
    "0x717d31a60a9e811469673429c9f8ea24358990f1",
    "0x51707dc661630f8fd624b985fa6ef4f1d4d919db",
  ];

  const fetchTokens = async () => {
    try {
      setLoading(true);

      // Encode the target addresses
      const encodedBatch = targetAddresses
        .map((address) => `base%3A${encodeURIComponent(address)}`)
        .join("%2C");

      // Replace ${chain} with the desired chain/network
      const chain = "base"; // Update this based on your requirements

      const url = `https://api.portals.fi/v2/tokens?ids=${encodedBatch}&platforms=native&platforms=basic&platforms=aavev2&platforms=aavev2wrapped&platforms=aavev3&platforms=aerodrome&platforms=agave&platforms=alienbase&platforms=apeswap&platforms=apeswap-lending&platforms=arcadia-v2&platforms=arbitrumexchange&platforms=aura&platforms=babydogeswap&platforms=balancerv2&platforms=balancerv2boosted&platforms=bankerjoe&platforms=baseswap&platforms=beethovenx&platforms=beethovenxboosted&platforms=beefy&platforms=biswap&platforms=benqi&platforms=camelotv2&platforms=cian&platforms=compound&platforms=compound-v3&platforms=convex&platforms=curve&platforms=curve-gauges&platforms=dfynv1&platforms=ethena&platforms=etherfi&platforms=equalizer&platforms=euler&platforms=fluid&platforms=fraxswap&platforms=fluxfinance&platforms=harvest-finance&platforms=gamma-thena&platforms=gamma-quickswap&platforms=gamma-camelot&platforms=gearbox&platforms=geist&platforms=gyroscope&platforms=honeyswap&platforms=hop-protocol&platforms=hop-protocol-tokens&platforms=ironbank&platforms=landx-finance&platforms=locus-finance&platforms=mdex&platforms=midas&platforms=mmfinance&platforms=morpho&platforms=moonwell&platforms=nomiswap&platforms=overnight-finance&platforms=pancakeswap&platforms=pangolin&platforms=pendle&platforms=pendle-pt&platforms=pendle-sy&platforms=pendle-yt&platforms=pooltogether&platforms=pooltogether-v5&platforms=quickswap&platforms=radiantv2&platforms=radpie&platforms=revert-finance&platforms=rocketswap&platforms=scream&platforms=seamless-protocol&platforms=shibaswap&platforms=silo-finance&platforms=silo-finance-llama&platforms=sonne-finance&platforms=soswap&platforms=spark&platforms=spiritswap&platforms=spookyswap&platforms=stablecomp&platforms=stakedao&platforms=stakedao-vaults&platforms=stakedao-gauges&platforms=stargate&platforms=sushiswap&platforms=swapbased&platforms=synthswap&platforms=thegranary&platforms=traderjoe&platforms=uniswapv2&platforms=uwulend&platform=velodrome-v2&platforms=venus&platforms=verse&platforms=vesper&platforms=yearn&platforms=yearn-v3&platforms=yearncrv&platforms=yieldyak&platforms=custom&networks=${chain}&sortDirection=asc&limit=250&page=0`;
      const authToken = import.meta.env.VITE_API_KEY;
       
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
       const tokens = response.data.tokens;
       const ethToken = {
         address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
         addresses: {
           base: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
         },
         decimals: 18,
         image: eth,
         key: "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
         liquidity: 4044100000,
         metadata: {},
         metrics: {
           volumeUsd1d: "2622.4153281237977",
         },
         name: "ETH",
         network: "base",
         platform: "basic",
         price: 3355.26,
         symbol: "ETH",
         totalSupply: "29840000000",
       };
        const updatedAssets = [ethToken, ...tokens];
        setAssets(updatedAssets);
      
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []); // Only call getBscTokenKey on component mount


const formatNumber = (num) => {
  // Convert number to string and split into integer and fractional parts
  const numStr = num.toString();
  const [integerPart, fractionalPart] = numStr.split(".");

  if (!fractionalPart) return numStr; // Return as-is if no fractional part

  // Count leading zeros in the fractional part
  const leadingZeros = fractionalPart.match(/^0*/)[0].length;

  // Limit the fractional part to three digits after the leading zeros
  const limitedFraction = fractionalPart.slice(leadingZeros, leadingZeros + 3);

  // Format the result with subscript for leading zeros
  return (
    <>
      {integerPart}.0
      <sub>{leadingZeros}</sub>
      {limitedFraction}
    </>
  );
};

  useEffect(() => {
    const filtered = assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.address.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by address
    );
    setFilteredAssets(filtered);
  }, [searchTerm, assets]);

  const options = ["Pancake", "Venus", "Uniswap", "Stargate", "Apebond"];
  const optionsSort = [
    "Balance UP",
    "Balance DOWN",
    "Market Cap/TVL UP",
    "Market Cap/TVL DOWN",
    "APY UP",
    "APY DOWN",
    "Volume UP",
    "Volume DOWN",
  ];

  const handleOptionSelect = (option) => {
    setSelectionProtocol(option);
    setIsOpen(false);
  };

  const handleOptionSelectSort = (optionsSort) => {
    setSelectionSort(optionsSort);
    setIsOpenSort(false);
  };
 function formatLongNum(number) {
   // Ensure the number is a valid number (convert it if it's a string or any other type)
   const validNumber = Number(number);

   // Check if the value is a valid number
   if (isNaN(validNumber)) {
     return "Invalid Number";
   }

   // Function to format a number with up to 3 decimals
   const formatWithDecimals = (num, decimals = 2) => {
     return new Intl.NumberFormat("en-US", {
       minimumFractionDigits: 0,
       maximumFractionDigits: decimals,
     }).format(num);
   };

   // For billions (10 or more digits)
   if (validNumber >= 1000000000) {
     const billions = validNumber / 1000000000;
     return `${formatWithDecimals(billions)}B`;
   }
   // For millions (7-9 digits)
   else if (validNumber >= 1000000) {
     const millions = validNumber / 1000000;
     return `${formatWithDecimals(millions)}M`;
   }
   // For smaller numbers (showing up to 3 decimals)
   return formatWithDecimals(validNumber);
 }



  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center gap-2 border border-white/10 p-2 px-4 rounded-[10px] bg-gray-600/20">
      <div className="h-5 w-5 flex bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg p-2">
        <div className="bg-[#171628] w-full  sm:w-[465px] sm:h-[420px] sm:max-h-[420px] rounded-[16px] p-2 sm:p-5 shadow-lg space-y-2">
          {/* Fixed Header */}
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-md font-semibold">Select asset</p>
            <IoClose className="size-4 cursor-pointer" onClick={closeModal} />
          </div>
          <div className="bg-transparent border border-white/10 rounded-[30px] p-1 sm:p-2 px-2 sm:px-4 flex items-center gap-2">
            <RiSearchLine />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-xs sm:text-sm"
              placeholder="Search by name, symbol or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            />
          </div>
          {/* <div className=" flex items-center gap-2">
            <div className="relative inline-block text-left">
            
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleDropdown}
                className="p-2 px-4 rounded-[30px] border border-white/10 w-fit text-[10px] flex items-center gap-2"
              >
                {selectionProtocol} <RiArrowDownSLine />
              </motion.button>

              
              {isOpen && (
                <div className="absolute mt-2 w-48 h-fit max-h-52 overflow-y-auto hide-scrollbar bg-[#171628] rounded-[16px] shadow-lg z-50 border border-white/10">
                  <ul className="p-2">
                    <li
                      className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/10"
                      onClick={() => handleOptionSelect("All Protocols")}
                    >
                      All Protocols
                    </li>
                    {options.map((option, index) => (
                      <li
                        key={index}
                        className="p-2 text-sm text-white hover:bg-white/10 rounded-[10px] cursor-pointer"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="relative inline-block text-left">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleDropdownSort}
                className="p-2 px-4 rounded-[30px] border border-white/10 w-fit text-[10px] flex items-center gap-2"
              >
                Sort by: {selectionSort} <RiArrowDownSLine />
              </motion.button>

              {isOpenSort && (
                <div className="absolute mt-2 w-48 h-fit max-h-52 overflow-y-auto hide-scrollbar bg-[#171628] rounded-[16px] shadow-lg z-50 border border-white/10">
                  <ul className="p-2">
                    <li
                      className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/10"
                      onClick={() => handleOptionSelectSort("Sort by:")}
                    >
                      Default
                    </li>
                    {optionsSort.map((option, index) => (
                      <li
                        key={index}
                        className="p-2 text-sm text-white hover:bg-white/10 rounded-[10px] cursor-pointer"
                        onClick={() => handleOptionSelectSort(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div> */}

          <div className="bg-white/5 p-1 sm:p-2 px-2 sm:px-4 rounded-[10px] text-[10px] sm:text-xs flex justify-between items-center">
            <p>ASSETS</p>
            <p>BALANCE</p>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto h-[170px] sm:h-[230px] hide-scrollbar space-y-1 sm:space-y-2">
            {loading ? (
              [...Array(5)].map((_, index) => <SkeletonLoader key={index} />)
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onTokenSelect(asset);
                    closeModal();
                  }}
                  className={`flex items-center gap-2 border border-white/10 p-1 sm:p-2 px-2 sm:px-4 rounded-[10px] cursor-pointer ${
                    selectedCard === index ? "bg-white/10" : "hover:bg-white/10"
                  }`}
                >
                  <img
                    className="sm:h-5 h-4 w-4 sm:w-5 flex text-xs border-2 border-white rounded-full"
                    src={
                      Array.isArray(asset.images) && asset.images.length > 0
                        ? asset.images[0] ||
                          asset.images[1] ||
                          "default-image-url"
                        : asset.image || "default-image-url"
                    }
                    alt={asset.name || "image"}
                  />
                  <div className="flex justify-between w-full">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] sm:text-xs">{asset.symbol}</p>
                        <p className="bg-white/5 rounded-[10px] p-1 text-[9px] sm:text-[10px] max-w-32 truncate">
                          {asset.address}
                        </p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-[#6E6D7B]">
                        {asset.name}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
                        <p className="text-white/70">
                          ${formatLongNum(asset.price)}
                        </p>
                        <p className="text-[#6E6D7B]">
                          MCap{" "}
                          <span className="text-white/70">
                            ${formatLongNum(asset.liquidity)}
                          </span>
                        </p>
                        <p className="text-[#6E6D7B]">
                          VOL{" "}
                          <span className="text-white/70">
                            ${formatLongNum(asset.totalSupply)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className='text-[10px] sm:text-base'>
                      {tokenBalances[asset.address] !== undefined &&
                      tokenBalances[asset.address] !== "0.0"
                        ? tokenBalances[asset.address] &&
                          formatNumber(tokenBalances[asset.address])
                        : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-400">No assets found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Select;
