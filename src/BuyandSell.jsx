import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LuArrowDownUp } from "react-icons/lu";


const BuyandSell = () => {
    // States to hold slider value and max value
    const [value, setValue] = useState(0);
    const [maxValue, setMaxValue] = useState(20); // Dynamic max value, can change as needed

    // Function to calculate the position of the label based on the slider value
    const calculateLabelPosition = () => {
        const percentage = (value / maxValue) * 100; // Adjust based on dynamic max value
        return `calc(${percentage}% - 10px)`;  // Adjust label position for better centering
    };

    // Function to update the background based on the slider value
    const getBackgroundSize = () => {
        return {
            background: `linear-gradient(to right, #6902F5 ${(value / maxValue) * 100}%, #e5e7eb ${(value / maxValue) * 100}%)`
        };
    };

    // Function to handle the 'MAX' button click
    const handleMaxClick = () => {
        setValue(maxValue); // Set the slider to the maximum dynamic value
    };

    return (
        <div className="">
            <div className='bg-[#171628] w-full h-fit rounded-[16px] p-3'>
                <p className='text-[#6E6D7B]'>You sell</p>
                <div className="flex justify-between items-center">
                    <input placeholder='0.0' className='w-56 bg-transparent outline-none text-white text-xl font-medium' />
                    <motion.button whileTap={{ scale: 0.9 }} className='border border-[#6E6D7B] hover:bg-[#6E6D7B]/20 p-2 px-4 flex text-sm rounded-[16px] items-center'>
                        Select token
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </motion.button>
                </div>
                <p className='flex justify-end text-xs text-[#6E6D7B] pt-1 font-medium'>Balance : 0.0</p>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center space-y-4 w-[290px]">
                        <div className="flex flex-col items-center w-full space-y-8">
                            <div className="relative w-full">
                                {/* Value label that moves with the dragger */}
                                <div
                                    className="absolute -top-5 text-white/60 text-sm font-medium"
                                    style={{ left: calculateLabelPosition() }}
                                >
                                    ${parseFloat(value).toFixed(1)}
                                </div>

                                {/* Slider input */}
                                <input
                                    type="range"
                                    min="0"
                                    max={maxValue} // Dynamic max value
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full h-2 bg-[#6E6D7B] rounded-lg appearance-none cursor-pointer custom-range"
                                    style={getBackgroundSize()} // Adjust the background color dynamically
                                />
                            </div>
                        </div>
                    </div>

                    {/* MAX Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleMaxClick} // Set max value on click
                        className="bg-[#25223F] border border-[#6E6D7B] text-sm px-5 rounded-[16px]"
                    >
                        MAX
                    </motion.button>
                </div>

                {/* Optional: Input to dynamically change the max value */}
                {/* <div className="flex justify-between items-center pt-3">
                <label className="text-sm text-white/60">Set Max Value:</label>
                <input
                    type="number"
                    min="0"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))} // Update max value dynamically
                    className="bg-transparent border border-[#6E6D7B] text-white px-2 py-1 rounded-md outline-none"
                />
            </div> */}
            </div>
            <motion.div whileTap={{ scale: 0.9 }} className=" bg-[#171628] p-2 w-fit mx-auto">
                <LuArrowDownUp className=' text-white' />
            </motion.div>

            <div className='bg-[#171628] w-full h-32 rounded-[16px] p-3'>
                <p className='text-[#6E6D7B]'>You buy</p>
                <div className="flex justify-between items-center">
                    <input placeholder='0.0' className='w-56 bg-transparent outline-none text-white text-xl font-medium' />
                    <motion.button whileTap={{ scale: 0.9 }} className='border border-[#6E6D7B] hover:bg-[#6E6D7B]/20 p-2 px-4 flex text-sm rounded-[16px] items-center'>
                        Select token
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default BuyandSell
