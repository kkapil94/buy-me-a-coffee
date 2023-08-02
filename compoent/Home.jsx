"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../styles/styles.css";
import abi from "../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json";

export default function Home() {
    
  const [memos, setMemos] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [details, setDetails] = useState({ name: "", msg: "" });
  const ContractAbi = abi.abi
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.id]: e.target.value });
  };

  //check wallet connected or not

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected :", account);
      } else {
        console.log("Make sure metamask is connected.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Connect Wallet

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure that metamask is installed");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  //buy coffee

  const buyCoffee = async (e) => {
    try {
      e.preventDefault();
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum, "any");
        const signer =await provider.getSigner()
        const coffeeContract = new ethers.Contract(
          "0xc2fAC66720621BfB9eBCf7fAF31185EB9Dab8015",
          ContractAbi,
          signer
        );
        console.log("buying coffee...");
        const coffee = await coffeeContract.buyCoffee(
          details.name,
          details.msg,
          {
            value: ethers.parseEther("0.001"),
          }
        );
        await coffee.wait();
        console.log("coffeeHash:", coffee.hash);
        console.log("coffee bought");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get memos
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum, "any");
        const signer =await provider.getSigner();
        const coffeeContract = new ethers.Contract(
          "0xc2fAC66720621BfB9eBCf7fAF31185EB9Dab8015",ContractAbi,signer
        );
        const memo = await coffeeContract.getMemos();
        setMemos(memo)
      } else {
        console.log("make sure the wallet is installed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isWalletConnected();
    console.log("work");
    getMemos();
  }, []);
  return (
    <div className="home flex">
      <h1 className="title">Buy Kapil A Coffee</h1>
      {!currentAccount ? (
        <button className="connect" onClick={connectWallet}>
          Connect wallet
        </button>
      ) : (
        <form className="form" onSubmit={buyCoffee}>
          <div>
            <label htmlFor="name" className="labels name">
              Name:
            </label>
            <input
              className="details"
              type="text"
              id="name"
              placeholder="Enter your name"
              value={details.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="msg" className="labels">
              Message:
            </label>
            <textarea
              className="details"
              placeholder="Type the message"
              cols={25}
              id="msg"
              value={details.msg}
              onChange={handleChange}
              required
            />
          </div>
          <div id="button">
            <button type="submit" className="submit" onClick={buyCoffee}>
              Buy a coffee for 0.001eth
            </button>
          </div>
        </form>
      )}
      <div>
        <div className="line"></div>
      </div>
      {currentAccount&&memos ? (
        <div >
          <h2 className="heading">Coffee received</h2>
          <div className="memo-container">
            {memos.map((memo) => (
              <div className="box">
                <span>From: {memo.name}</span>
                <span className="msg">Message: {memo.message}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
