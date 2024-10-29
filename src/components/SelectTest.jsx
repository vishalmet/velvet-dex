import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import axios from 'axios';

const SelectTest = ({ closeModal }) => {
  const [assets, setAssets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);
  const [selectionProtocol, setSelectionProtocol] = useState("All Protocols");
  const [selectionSort, setSelectionSort] = useState("Default");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Toggle dropdown for Protocol selection
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Toggle dropdown for Sort options
  const toggleDropdownSort = () => setIsOpenSort(!isOpenSort);

  // Fetch tokens dynamically from the API
// Fetch tokens dynamically from the API
const getTokens = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.velvet.capital/api/v3/token?networks=bsc', {
        headers: { 
          'Authorization': 'Bearer 31d0857c-0350-4a8f-b5b7-41e388c8e10e',
        }
      });
      
      // Ensure that response.data.tokens is an array
      if (response.data && Array.isArray(response.data)) {
        setAssets(response.data); // Only set if valid
      } else {
        console.error('Unexpected API response format:', response.data);
        setAssets([]); // Set empty array if the structure is unexpected
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching token data:', error);
      setLoading(false);
      setAssets([]); // Set empty array on error
    }
  };
  
  // Filter assets based on search term
  useEffect(() => {
    if (Array.isArray(assets)) { // Check if assets is an array before filtering
      const filtered = assets.filter((asset) =>
        asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssets(filtered);
    }
  }, [searchTerm, assets]);
  

  const handleOptionSelect = (option) => {
    setSelectionProtocol(option);
    setIsOpen(false);
  };

  const handleOptionSelectSort = (option) => {
    setSelectionSort(option);
    setIsOpenSort(false);
  };

  // Skeleton Loader for loading state
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
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
        <div className="bg-[#171628] w-[465px] h-[420px] max-h-[420px] rounded-[16px] p-5 shadow-lg space-y-2">
          {/* Modal Header */}
          <div className="flex justify-between items-center">
            <p className="text-md font-semibold">Select Asset</p>
            <IoClose className="size-4 cursor-pointer" onClick={closeModal} />
          </div>

          {/* Search Bar */}
          <div className="bg-transparent border border-white/10 rounded-[30px] p-2 px-4 flex items-center gap-2">
            <RiSearchLine />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Search by name, symbol or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Protocol and Sort Selection */}
          <div className="flex items-center gap-2">
            <div className="relative inline-block text-left">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleDropdown}
                className="p-2 px-4 rounded-[30px] border border-white/10 w-fit text-[10px] flex items-center gap-2"
              >
                {selectionProtocol} <RiArrowDownSLine />
              </motion.button>

              {/* Protocol Dropdown */}
              {isOpen && (
                <div className="absolute mt-2 w-48 h-fit max-h-52 overflow-y-auto hide-scrollbar bg-[#171628] rounded-[16px] shadow-lg z-50 border border-white/10">
                  <ul className="p-2">
                    <li
                      className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/10"
                      onClick={() => handleOptionSelect("All Protocols")}
                    >
                      All Protocols
                    </li>
                    {/* Add more protocols if needed */}
                  </ul>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
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
                      onClick={() => handleOptionSelectSort("Default")}
                    >
                      Default
                    </li>
                    {/* Add sorting options dynamically */}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Asset List */}
          <div className="bg-white/5 p-2 px-4 rounded-[10px] text-xs flex justify-between items-center">
            <p>ASSETS</p>
            <p>PRICE</p>
          </div>

          <div className="overflow-y-auto h-[230px] hide-scrollbar space-y-2">
            {loading ? (
              [...Array(5)].map((_, index) => <SkeletonLoader key={index} />)
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCard(index)}
                  className={`flex items-center gap-2 border border-white/10 p-2 px-4 rounded-[10px] cursor-pointer ${selectedCard === index ? 'bg-white/10' : ''}`}
                >
                  <img src={asset.logo || '/default-logo.png'} alt={asset.name} className="h-6 w-6 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">{asset.name}</p>
                    <p className="text-xs text-gray-400">{asset.symbol}</p>
                  </div>
                  <p>{asset.price ? `$${asset.price.toFixed(4)}` : 'N/A'}</p>
                </div>
              ))
            ) : (
              <p className="text-center">No assets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTest;
