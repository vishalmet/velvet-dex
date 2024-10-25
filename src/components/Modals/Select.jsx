import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import assetsData from './assets.json';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Select = ({ closeModal }) => {
    const [assets, setAssets] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSort, setIsOpenSort] = useState(false);
    const [selectionProtocol, setselectionProtocol] = useState("All Protocols");
    const [selectionSort, setselectionSort] = useState("Default");


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const toggleDropdownSort = () => {
        setIsOpenSort(!isOpen);
    };

    const options = ["Pancake", "Venus", "Uniswap", "Stargate", "Apebond"];
    const optionsSort = ["Balance UP", "Balance DOWN", "Market Cap/TVL UP", "Market Cap/TVL DOWN", "APY UP", "APY DOWN", "Volume UP", "Volume DOWN"];

    const handleOptionSelect = (option) => {
        setselectionProtocol(option); 
        setIsOpen(false); 
    };
    
    const handleOptionSelectSort = (optionsSort) => {
        setselectionSort(optionsSort); 
        setIsOpenSort(false); 
    };

    useEffect(() => {
        setAssets(assetsData);
    }, []);

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
                        <input type="text" className='w-full bg-transparent outline-none' />
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
                                        {/* Default Option */}
                                        <li
                                            className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/10"
                                            onClick={() => handleOptionSelect("All Protocols")}
                                        >
                                            All Protocols
                                        </li>
                                        {/* Other Options */}
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
                            {/* Dropdown Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDropdownSort}
                                className="p-2 px-4 rounded-[30px] border border-white/10 w-fit text-[10px] flex items-center gap-2"
                            >
                                Sort by : {selectionSort} <RiArrowDownSLine />
                            </motion.button>

                            {/* Dropdown Menu */}
                            {isOpenSort && (
                                <div className="absolute mt-2 w-48 h-fit max-h-52 overflow-y-auto hide-scrollbar bg-[#171628] rounded-[16px] shadow-lg z-50 border border-white/10">
                                    <ul className="p-2">
                                        {/* Default Option */}
                                        <li
                                            className="p-2 text-sm text-white hover:bg-white/10 cursor-pointer border-b border-white/10"
                                            onClick={() => handleOptionSelectSort("Sort by :")}
                                        >
                                            Default
                                        </li>
                                        {/* Other Options */}
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
                    <div className="overflow-y-auto h-[230px] hide-scrollbar space-y-2 py-3"> {/* Set height for scrolling */}
                        {assets.map((asset, index) => (
                            <div key={index} className="flex items-center gap-2 border border-white/10 p-2 px-4 rounded-[10px] hover:bg-white/10 ">
                                <img className="h-3 w-3 flex text-xs" src={asset.image || 'default-image-url'} alt={asset.name || 'default'} />
                                <div>
                                    <div className="flex items-center gap-1">
                                        <p className="text-xs">{asset.symbol}</p>
                                        <p className="bg-white/5 rounded-[10px] p-1 text-[10px] max-w-32 truncate">{asset.address}</p>
                                    </div>
                                    <p className="text-xs text-[#6E6D7B]">{asset.name}</p>
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <p className="text-white/70">{asset.price}</p>
                                        <p className="text-[#6E6D7B]">MCap <span className="text-white/70">{asset.marketCap}</span></p>
                                        <p className="text-[#6E6D7B]">VOL <span className="text-white/70">{asset.volume}</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Select;

