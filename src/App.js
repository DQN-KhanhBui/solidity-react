import React, { useState, useEffect } from 'react';
import './App.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./utils/loadContract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null
  });
  const [walletAddress, setWalletAddress] = useState("Pls, you must loggin Metamask!");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Wallet", provider);
      console.log(contract);
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider: provider,
          contract: contract
        })
      } else {
        setWalletAddress("Pls, install metamask!");
      }
    }
    loadProvider();
  }, []);

  const getWalletAddressAndBalance = async () => {
    const { web3 } = web3Api;
    const _walletAddress = await web3.eth.getAccounts();
    const _balance = await web3.eth.getBalance(`${_walletAddress}`);
    setWalletAddress(_walletAddress);
    setBalance(web3.utils.fromWei(_balance, "ether"));
  }

  const loginMetamask = async () => {
    await web3Api.provider.request({method: "eth_requestAccounts"});
    if (web3Api.web3 != null) {
      getWalletAddressAndBalance();
    }
  }

  const addFunder = async () => {
    const { web3, contract } = web3Api;
    await contract.addFunder({
      from: `${walletAddress}`,
      value: web3.utils.toWei("1", "ether")
    });
    getWalletAddressAndBalance();
  }

  const withdraw = async () => {
    const { web3, contract } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.5", "ether");
    await contract.withdraw(withdrawAmount, {
      from: `${walletAddress}`
    });
    getWalletAddressAndBalance();
  }

  return (
    <React.Fragment>
      <Card className="text-center mx-5 mt-5">
        <Card.Header>Training Solidity with ReactJS and Truffle - Ganache - Metamask</Card.Header>
        <Card.Body>
          <Card.Title>Current Balance: {balance} ETH</Card.Title>
          <Card.Text>
            Wallets Address: {walletAddress}
          </Card.Text>
          <ButtonGroup>
            <Button variant="outline-success" onClick={addFunder}>Donate</Button>
            <Button variant="outline-danger" className="mx-2" onClick={withdraw}>Withdraw</Button>
            <Button variant="outline-primary" onClick={loginMetamask}>Connect Wallets</Button>
          </ButtonGroup>
        </Card.Body>
        <Card.Footer className="text-muted">Now</Card.Footer>
    </Card>
    </React.Fragment>
  );
};

export default App;
