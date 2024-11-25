import Web3 from "web3";
import { ethers } from "ethers";
import Erc20Abi from "./tokenabi.json";

const countTotalDigits = (number) => {
  if (typeof number !== "string") {
    number = number.toString();
  }
  return number.replace(".", "").length;
};

const convertToInt = (amount, decimals) => {
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

const convertToDecimal = (amount, decimals) => {
  return ethers.utils.formatUnits(amount, decimals);
};
const limitDecimalPlaces = (amount, decimals = 18) => {
  // Convert the amount to a string if it's not
  if (typeof amount !== "string") {
    amount = amount.toString();
  }

  // Find the position of the decimal point
  const [integer, fraction] = amount.split(".");

  // If there is no fraction part or the fraction is smaller than the decimal limit, return the original number
  if (!fraction || fraction.length <= decimals) {
    return amount;
  }

  // Truncate the fraction part to the specified number of decimal places
  const truncatedFraction = fraction.slice(0, decimals);
  return `${integer}.${truncatedFraction}`;
};


export const swapTokenMetaSolver = async (
  amount,
  sellTokenAddress,
  buyTokenAddress,
  slippage,
  provider,
  chainId,
  metaSolverData
) => {
  console.log("🚀 ~ slippage:", slippage);
  console.log("🚀 ~ amount:", amount);

  const web3 = new Web3(provider);

  console.log("web3",web3)
  const providers = new ethers.providers.Web3Provider(provider);
  const signer = providers.getSigner();
  const gasPrice = await web3.eth.getGasPrice();
  const account = await web3.eth.requestAccounts();
  const userAddress = account[0];

  let sellTokenDecimal;
  if (
    sellTokenAddress.toLowerCase() !==
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  ) {
    const SellTokenErc20Instance = new web3.eth.Contract(
      Erc20Abi,
      sellTokenAddress
    );
    sellTokenDecimal = await SellTokenErc20Instance.methods.decimals().call();
  } else {
    sellTokenDecimal = "18";
  }

  

  let buyTokenDecimal;
  if (
    buyTokenAddress.toLowerCase() !==
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  ) {
    const BuyTokenErc20Instance = new web3.eth.Contract(
      Erc20Abi,
      buyTokenAddress
    );
    buyTokenDecimal = await BuyTokenErc20Instance.methods.decimals().call();
  } else {
    buyTokenDecimal = "18";
  }

  

  const amountDecimalCheck = countTotalDigits(amount);

  

  if (
    sellTokenAddress.toLowerCase() !==
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  ) {
    
    const Erc20Instance = new web3.eth.Contract(Erc20Abi, sellTokenAddress);

    const getAllowance = await Erc20Instance.methods
      .allowance(userAddress, metaSolverData?.tx.to)
      .call();

     

    const convertedAllowance = convertToInt(
      getAllowance,
      Number(sellTokenDecimal)
    );

    
    if (parseFloat(convertedAllowance) < parseFloat(amount)) {
      
      await Erc20Instance.methods
        .approve(
          metaSolverData?.tx?.to,
          24365235623523512351235
         
        )
        .send({
          from: userAddress,
          gas: chainId === 56 ? "10000000" : "18000000",
          gasPrice: gasPrice.toString(),
        });

        
    }
  }

  let solver = metaSolverData?.tx;

  console.log("solver",solver)

  const txData = {
    to: solver.to,
    data: solver.data,
    value: ethers.BigNumber.from(solver.value),
    gasLimit: parseInt((+metaSolverData?.gas * 1.5).toString()).toString(),
  };

  const txReceipt = await signer.sendTransaction(txData);

  const receipt = await txReceipt.wait();

  return receipt;
};
