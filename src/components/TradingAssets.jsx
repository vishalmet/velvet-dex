import React from 'react'
import successimg from '../assets/successimg.svg'


const TradingAssets = ({ handleTradingAssetClose, processing, success, transCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center min-h-screen backdrop-blur-lg ">
      <div className="border border-[#ffffff5b] rounded-2xl w-[290px] sm:w-fit p-2 sm:p-6  bg-[#171628]">
        <div className="flex flex-col gap-3">
          <h1 className="text-base sm:text-2xl font-bold">Trading Assets</h1>
          <div className="mt-1 sm:mt-4 ">
            <h3 className="font-semibold text-[12px] sm:text-sm">
              Don't close this tab or this will halt the trade process.
            </h3>
            <p className="text-[10px] sm:text-[12px] text-[#ffffff5b] mt-1">
              You will be asked to verify transactions at each step.
            </p>
          </div>
          {transCancel && (
            <div
              className="border-2 alert-border rounded-2xl flex gap-3 items-center p-4 font-semibold text-lg w-full sm:w-[27rem] "
              style={{ borderColor: "rgb(243, 18, 96)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5"
                  stroke="#F31260"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M11.995 16h.009"
                  stroke="#F31260"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>{" "}
              Trading Assets
            </div>
          )}
          {success && (
            <div className="border-[1px] border-[#ffffff63] rounded-3xl flex gap-3 items-center p-4 font-semibold text-lg w-full sm:w-[27rem] bg-[#ffffff07] ">
              <img src={successimg} alt="" /> Trading Assets
            </div>
          )}

          {processing && (
            <div className="border-2 border-[#7000ff] rounded-2xl flex justify-between items-center p-4 font-semibold text-lg w-full sm:w-[27rem]">
              <div className="flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="1.5"
                    d="M20.5 14.99l-5.01 5.02M3.5 14.99h17M3.5 9.01l5.01-5.02M20.5 9.01h-17"
                  ></path>
                </svg>
                Trading Assets
              </div>

              <div className="relative flex w-8 h-8">
                <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-[3px] border-[#7000ff]"></i>
                <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-[3px] border-[#7000ff]"></i>
              </div>
            </div>
          )}
          {processing && (
            <div className="relative w-full h-10">
              <p className="bg-[#6f00ffac] w-fit rounded-full py-1.5 px-3 text-xs sm:text-base flex gap-2 items-center absolute top-1 right-4">
                Processing{" "}
                <div class="relative flex w-3 h-3 sm:w-5 sm:h-5">
                  <i class="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-3 border-b-primary"></i>
                  <i class="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-3 border-b-primary"></i>
                </div>
              </p>
            </div>
          )}
          {success && (
            <div className="relative w-full h-10">
              <button
                className="bg-[#7000ff] w-fit rounded-full py-1.5 px-3 text-xs sm:text-base flex gap-2 items-center absolute top-1 right-4"
                onClick={handleTradingAssetClose}
              >
                Done
              </button>
            </div>
          )}
          {transCancel && (
            <div className="relative w-full h-10">
              {/* Other content */}
              <button
                className="absolute top-1 right-4 py-2 px-5 rounded-full hover:bg-[#ffffff1d] "
                onClick={handleTradingAssetClose}
              >
                close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingAssets
