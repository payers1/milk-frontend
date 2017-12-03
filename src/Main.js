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

import { Grid } from 'semantic-ui-react'

const Metric = withColumn(MetricDisplay)
const Task = withColumn(TaskDisplay, 5)
const Step = withColumn(StageDisplay)
const Exchange = withColumn(ExchangeDisplay, 9)

class Main extends Component {
  state = {
    contract: {},
    coin: {},
    stage: {task: {}}
  }

  async componentDidMount() {
    const { uport } = this.props
    const { coin, milk } = await getContract()
    this.setState({
      coin: uport.contract(coin.contract.abi).at(coin.location),
      contract: uport.contract(milk.contract.abi).at(milk.location)
    })
    this.getContractValues()
  }

  getContractValues = async () => {
    const vals = await getContractValues(this.props.uPortAccount)
    this.setState(vals);
  }

  render() {
    const { coinBalance, stage, contract, totalSupply, contractCoinBalance, coinOwnerBalance } = this.state;
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
          <Task nextTask={stage.task} contract={contract} web3={this.props.uport.getWeb3()} />
          <Exchange user={this.props.name} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Main
