import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceOfOwnerButton = document.getElementById("getBalanceOfOwnerButton");
const getBalanceOfContractButton = document.getElementById("getBalanceOfContractButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceOfContractButton.onclick = getBalanceOfContract;
getBalanceOfOwnerButton.onclick = getBalanceOfOwner;
withdrawButton.onclick = withdraw;

async function connect() {
    // get the provider
    // get the wallet address or signer
    // deploy contract11
    // contract address and ABI
    if (window.ethereum) {
        try {
            const chainId = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log(chainId);
            console.log("connecting to metamask");
            connectButton.innerHTML = "Connected";
        } catch (error) {
            console.log(error);
        }
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(ethAmount);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            await listenForTheTransaction(transactionResponse, provider);
            console.log(`Done`);
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTheTransaction(transactionResponse, provider) {
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Listening for transaction ${transactionReceipt}`);
            resolve();
        });
    });
}

async function getBalanceOfOwner() {
    if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const wallet = provider.getSigner()
        const balance = await wallet.getBalance();
        console.log(ethers.utils.formatEther(balance));
    }
}

async function getBalanceOfContract() {
    if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(wallet));
    }
}

async function withdraw(){
    if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,wallet);
        try {
            const withdraw = await contract.withdraw();
            await listenForTheTransaction(withdraw,provider);
            console.log("Transaction Withdrawn from Contract worth",await getBalanceOfContract());
        } catch (error) {
            console.log(error);
        }
    }
}