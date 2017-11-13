import React, { Component } from 'react'
import { Metric } from './components';

import {
  getContractValues,
  getContract
} from './api';

import { Grid } from 'semantic-ui-react'

class Main extends Component {
  state = {
    contract: {},
    coin: {}
  }

  async componentDidMount() {
    let { uport, web3 } = this.props
    const { coin, milk } = await getContract()
    console.log(uport, web3);
    const localWeb3 = uport.isOnMobile ? uport.getWeb3() : web3

    this.setState({
      coin: localWeb3.eth.contract(coin.contract.abi).at(coin.location),
      contract: localWeb3.eth.contract(milk.contract.abi).at(milk.location)
    })

    this.getContractValues()
    // this.setupWatchers()
  }

  getContractValues = async () => {
    const { contract, coin } = this.state
    const { account } = this.props
    const vals = await getContractValues(contract, account, coin)
    this.setState(vals);
  }

  setupWatchers = () => {
    const { contract, coin } = this.state
    contract.allEvents().watch((err, evt) => console.log('all events', err, evt));
    coin.allEvents().watch((err, evt) => console.log('coin events', err, evt));
  }

  render() {
    const { outOfMilk, coinBalance } = this.state
    return (
      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Metric metric={outOfMilk ? 'EMPTY' : 'FULL'} label="Milk Status" />
          </Grid.Column>
          <Grid.Column>
            <Metric metric={`${coinBalance} Coins`} label="Balance" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Main
