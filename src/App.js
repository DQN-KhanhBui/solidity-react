import React, { useState, useEffect } from 'react';
import './App.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        provider.request({method: "eth_requestAccounts"});
        // setWeb3Api({
        //   provider: provider,
        //   web3: new Web3(provider)
        // })
      } else {
        console.log("Pls, install metamask!");
      }
    }
    loadProvider();
  }, []);

  return (
    <React.Fragment>
      <Card className="text-center mx-5 mt-5">
        <Card.Header>Training Solidity with ReactJS and Truffle - Ganache - Metamask</Card.Header>
        <Card.Body>
          <Card.Title>Current Balance: 10ETH</Card.Title>
          <Card.Text>
            Account Address: 0x132C06849aDB4B76D5C356fd5C8B86f121EFBC00
          </Card.Text>
          <ButtonGroup>
            <Button variant="success">Donate</Button>
            <Button variant="danger" className="mx-2">Withdraw</Button>
            <Button variant="primary">Connect Wallets</Button>
          </ButtonGroup>
        </Card.Body>
        <Card.Footer className="text-muted">Now</Card.Footer>
    </Card>
    </React.Fragment>
  );
};

export default App;
