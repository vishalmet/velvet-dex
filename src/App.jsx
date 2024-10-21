import React from 'react'
import CustomButton from './components/Wallet'
import CardHead from './components/CardHead'
import BuyandSell from './BuyandSell'

const App = () => {
  return (
    <div className=' bg-[#171628] min-h-screen inter-font text-white'>
      <div className=" flex justify-center items-center min-h-screen">
        <div className=" ">
        <p className=' text-center text-white text-3xl font-semibold pb-3'>All DeFi at your fingertips</p>
        <CustomButton />
        <div className="bg-gradient-to-br from-[#3B1D8F] via-[#6c2bc6] to-[#27035D] w-[455px] h-96 rounded-b-[32px] p-4">
          <CardHead />
          <BuyandSell />
        </div>
        </div>
      </div>
    </div>
  )
}

export default App