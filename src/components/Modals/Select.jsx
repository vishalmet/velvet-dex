import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import axios from 'axios';

const Select = ({ closeModal }) => {
    const [assets, setAssets] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSort, setIsOpenSort] = useState(false);
    const [selectionProtocol, setSelectionProtocol] = useState("All Protocols");
    const [selectionSort, setSelectionSort] = useState("Default");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const toggleDropdownSort = () => {
        setIsOpenSort(!isOpenSort);
    };

    // Fetch token data dynamically from API
    const getTokens = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('https://api.portals.fi/v2/tokens?networks=bsc', {
                headers: { 'Authorization': 'Bearer 31d0857c-0350-4a8f-b5b7-41e388c8e10e',
                    //    params: {
        //   search: 'frax',
        //   platforms: 'curve',
        //   networks: 'bnb',
        //   sortBy: 'liquidity',
        //   sortDirection: 'desc'
        //   limit: 250
        // }
                 }
            });
            setAssets(response.data.tokens);
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching token data:', error);
            setLoading(false); // Stop loading in case of an error
        }
    };

    useEffect(() => {
        getTokens();
    }, []);

    useEffect(() => {
        const filtered = assets.filter((asset) =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.address.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by address
        );
        setFilteredAssets(filtered);
    }, [searchTerm, assets]);

    const options = ["Pancake", "Venus", "Uniswap", "Stargate", "Apebond"];
    const optionsSort = ["Balance UP", "Balance DOWN", "Market Cap/TVL UP", "Market Cap/TVL DOWN", "APY UP", "APY DOWN", "Volume UP", "Volume DOWN"];

    const handleOptionSelect = (option) => {
        setSelectionProtocol(option);
        setIsOpen(false);
    };

    const handleOptionSelectSort = (optionsSort) => {
        setSelectionSort(optionsSort);
        setIsOpenSort(false);
    };


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
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
                <div className="bg-[#171628] w-[465px] h-[420px] max-h-[420px] rounded-[16px] p-5 shadow-lg space-y-2">
                    {/* Fixed Header */}
                    <div className="flex justify-between items-center">
                        <p className="text-md font-semibold">Select asset</p>
                        <IoClose className="size-4 cursor-pointer" onClick={closeModal} />
                    </div>
                    <div className="bg-transparent border border-white/10 rounded-[30px] p-2 px-4 flex items-center gap-2">
                        <RiSearchLine />
                        <input
                            type="text"
                            className='w-full bg-transparent outline-none text-sm'
                            placeholder="Search by name, symbol or address"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                        />
                    </div>
                    <div className=" flex items-center gap-2">
                        <div className="relative inline-block text-left">
                            {/* Dropdown Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDropdown}
                                className="p-2 px-4 rounded-[30px] border border-white/10 w-fit text-[10px] flex items-center gap-2"
                            >
                                {selectionProtocol} <RiArrowDownSLine />
                            </motion.button>

                            {/* Dropdown Menu */}
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
                    </div>

                    <div className="bg-white/5 p-2 px-4 rounded-[10px] text-xs flex justify-between items-center">
                        <p>ASSETS</p>
                        <p>BALANCE</p>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="overflow-y-auto h-[230px] hide-scrollbar space-y-2">
                        {loading ? (
                            [...Array(5)].map((_, index) => <SkeletonLoader key={index} />)
                        ) : filteredAssets.length > 0 ? (
                            filteredAssets.map((asset, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedCard(index)} // Update selected card on click
                                    className={`flex items-center gap-2 border border-white/10 p-2 px-4 rounded-[10px] cursor-pointer ${selectedCard === index ? 'bg-white/10' : 'hover:bg-white/10'
                                        }`}
                                >
                                    <img
                                        className="h-5 w-5 flex text-xs border-2 border-white rounded-full"
                                        src={
                                            Array.isArray(asset.images) && asset.images.length > 0
                                                ? asset.images[0] || asset.images[1] || 'default-image-url'
                                                : asset.image || 'default-image-url'
                                        }
                                        alt={asset.name || 'image'}
                                    />
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-xs">{asset.symbol}</p>
                                            <p className="bg-white/5 rounded-[10px] p-1 text-[10px] max-w-32 truncate">
                                                {asset.address}
                                            </p>
                                        </div>
                                        <p className="text-xs text-[#6E6D7B]">{asset.name}</p>
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <p className="text-white/70">{asset.price}</p>
                                            <p className="text-[#6E6D7B]">
                                                MCap <span className="text-white/70">{asset.price}</span>
                                            </p>
                                            <p className="text-[#6E6D7B]">
                                                VOL <span className="text-white/70">{asset.volume}</span>
                                            </p>
                                        </div>
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
