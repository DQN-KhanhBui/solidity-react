import React, { useState, useEffect } from 'react';
import './App.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./utils/loadContract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null
  });
  const [walletGanache, setWalletGanache] = useState("Pls, you must loggin Metamask!");
  const [balanceGanache, setBalanceGanache] = useState(0);
  const [walletContract, setWalletContract] = useState("Pls, you must loggin Metamask!");
  const [balanceContract, setBalanceContract] = useState(0);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Wallet", provider);
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider: provider,
          contract: contract
        })
      } else {
        setWalletGanache("Pls, install metamask!");
      }
    }
    loadProvider();
  }, []);

  const getWalletGanacheAndBalanceGanache = async () => {
    const { web3, contract } = web3Api;
    const _walletGanache = await web3.eth.getAccounts();
    const _balanceGanache = await web3.eth.getBalance(`${_walletGanache}`);
    setWalletGanache(_walletGanache);
    setBalanceGanache(web3.utils.fromWei(_balanceGanache, "ether"));
    const _walletContract = contract.address;
    const _balanceContract = await web3.eth.getBalance(contract.address);
    setWalletContract(_walletContract);
    setBalanceContract(web3.utils.fromWei(_balanceContract, "ether"));
  }

  const loginMetamask = async () => {
    await web3Api.provider.request({method: "eth_requestAccounts"});
    if (web3Api.web3 != null) {
      getWalletGanacheAndBalanceGanache();
    }
  }

  const addFunder = async () => {
    const { web3, contract } = web3Api;
    await contract.addFunder({
      from: `${walletGanache}`,
      value: web3.utils.toWei("1", "ether")
    });
    getWalletGanacheAndBalanceGanache();
  }

  const withdraw = async () => {
    const { web3, contract } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.5", "ether");
    await contract.withdraw(withdrawAmount, {
      from: `${walletGanache}`
    });
    getWalletGanacheAndBalanceGanache();
  }

  return (
    <React.Fragment>
      {/* Wallet Ganache */}
      <Card className="text-center mx-5 mt-4">
        <Card.Header>Training Solidity with ReactJS and Truffle - Ganache - Metamask</Card.Header>
        <Card.Body>
          <Card.Title>Current Balance: {balanceGanache} ETH</Card.Title>
          <Card.Text>
            Wallets Address: {walletGanache}
          </Card.Text>
          <Button variant="outline-success" onClick={addFunder}>Donate</Button>
        </Card.Body>
        <Card.Footer className="text-muted">Wallet Ganache</Card.Footer>
      </Card>
      {/* Login Metamask */}
      <div className="mt-4 d-flex justify-content-center">
        <Button variant="outline-primary" onClick={loginMetamask}>Connect Wallets</Button>
      </div>
      {/* Wallet Contract */}
      <Card className="text-center mx-5 mt-4">
          <Card.Header>Training Solidity with ReactJS and Truffle - Ganache - Metamask</Card.Header>
          <Card.Body>
            <Card.Title>Current Balance: {balanceContract} ETH</Card.Title>
            <Card.Text>
              Wallets Address: {walletContract}
            </Card.Text>
            <Button variant="outline-danger" className="mx-2" onClick={withdraw}>Withdraw</Button>
          </Card.Body>
          <Card.Footer className="text-muted">Wallet Contract</Card.Footer>
      </Card>
    </React.Fragment>
  );
};

export default App;
