import React, { Component } from 'react'
import {
  Metric as MetricDisplay,
  Task as TaskDisplay,
  Step as StageDisplay,
  Exchange as ExchangeDisplay
} from './components';

import {
  getContractValues,
  getContract
} from './api';

import withColumn from './utils/withColumn'
import getWeb3 from './utils/getWeb3'

import { Grid } from 'semantic-ui-react'

const Metric = withColumn(MetricDisplay)
const Task = withColumn(TaskDisplay, 5)
const Step = withColumn(StageDisplay)
const Exchange = withColumn(ExchangeDisplay, 9)
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

class Main extends Component {
  state = {
    contract: {},
    coin: {},
    stage: {task: {}}
  }

  async componentDidMount() {
    const { uport } = this.props
    const { coin, milk } = await getContract()
    const { web3 } = isProd ? uport.getWeb3() : await getWeb3
    this.setState({
      web3,
      coin: isProd ? uport.contract(coin.contract.abi).at(coin.location) :
                     new web3.eth.Contract(coin.contract.abi, coin.location),
      contract: isProd ? uport.contract(milk.contract.abi).at(milk.location) :
                         new web3.eth.Contract(milk.contract.abi, milk.location)
    })
    this.getContractValues()
  }

  getContractValues = async () => {
    const accounts = await this.state.web3.eth.getAccounts()
    const account = !isProd ? accounts[0] : this.props.uPortAccount
    const vals = await getContractValues(account)
    this.setState(vals);
  }

  render() {
    const {
      coinBalance,
      stage,
      contract,
      totalSupply,
      contractCoinBalance,
      coinOwnerBalance,
      web3,
      hasAccess
    } = this.state;
    return (
      <Grid stackable>
        <Grid.Row columns={2}>
          <Metric metric={stage.title} label="Stage" />
          <Metric metric={`${coinBalance} Coins`} label="My Balance" />
        </Grid.Row>
        <Grid.Row>
          <Step stage={stage} />
        </Grid.Row>
        <Grid.Row columns={3}>
          <Metric metric={totalSupply} label='Total Supply' />
          <Metric metric={contractCoinBalance} label='Contract Coin Balance' />
          <Metric metric={coinOwnerBalance} label='Coin Owner Balance' />
        </Grid.Row>
        <Grid.Row>
          <Task nextTask={stage.task} contract={contract} web3={web3} />
          <Exchange user={this.props.name} hasAccess={hasAccess} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Main
