import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import {getAccounts, getContract} from './api'
import './App.css';

import P from 'bluebird'

import Main from './Main';
import Register from './Register';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      userAuth: false,
      account: null,
      web3: {}
    }
  }

  componentWillMount() {
    return getWeb3
    .then(({web3}) => {
      this.setState({
        web3
      })
      return getContract()
    })
    .then(async ({coin, milk}) => {
      const coinContract = this.state.web3.eth.contract(coin.contract.abi).at(coin.location);
      const milkContract = this.state.web3.eth.contract(milk.contract.abi).at(milk.location)
      const [account] = await getAccounts(this.state.web3);
      const userAuth = await P.promisify(milkContract.addressHasAccess)(account)
      return this.setState({
        milkContract,
        account,
        coinContract,
        userAuth,
        loading: false
      });
    })
  }

  render() {
    const { loading, userAuth, account, web3, coinContract, milkContract } = this.state;
    if (loading) {
      return <h1>Loading...</h1>
    } else if (!userAuth) {
      return <Register account={account}/>
    }
    return (
      <Main
        account={account}
        web3={web3}
        coin={coinContract}
        contract={milkContract} />
    )
  }
}

export default App
