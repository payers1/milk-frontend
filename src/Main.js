import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css';
import {
  Task,
  Metric,
  Log
} from './components';

import {
  recordMilkOutage,
  verifyMilkOutage,
  recordGotMilk,
  verifyGotMilk,
  getContractValues
} from './api';

import { Grid, Container } from 'semantic-ui-react'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nextTask: {}
    }
  }

  componentWillMount() {
    this.getContractValues()
    this.setupWatchers()
  }

  getContractValues = async () => {
    const vals = await getContractValues(this.props.contract, this.props.account, this.props.coin)
    this.setState(vals);
    this.getNextTask();
  }

  setupWatchers = () => {
    const { web3, contract, account, coin } = this.props
    web3.eth.filter('latest')
            .watch((error, result) => this.getContractValues(contract, account))

    contract.allEvents().watch((err, evt) => console.log('all events', err, evt));
    coin.allEvents().watch((err, evt) => console.log('coin events', err, evt));
  }

  getNextTask = () => {
    const stage = this.state.stage;
    const {account, contract, web3, unverifiedMilkBarCode, verifiedMilkBarCode} = this.props;
    let nextTask = {}
    switch (stage) {
      case 'MilkInFullSupply':
        nextTask = {
          title: 'RECORD OUTAGE',
          action: recordMilkOutage.bind(null, account, contract, web3)
        }
      break;

      case 'MilkOutageUnverified':
        nextTask = {
          title: 'VERIFY MILK OUTAGE',
          action: verifyMilkOutage.bind(null, account, contract, web3)
        }
      break;

      case 'MilkOutageVerified':
        nextTask = {
          title: 'BUY MILK',
          action: recordGotMilk.bind(null, account, contract, web3, unverifiedMilkBarCode)
        }
      break;

      case 'MilkPurchasedUnverified':
        nextTask = {
          title: 'VERIFY MILK',
          action: verifyGotMilk.bind(null, account, contract, web3, verifiedMilkBarCode)
        }
      break;
      default:
    }

    this.setState({
      nextTask
    })
  }

  render() {
    const { outOfMilk, coinBalance, nextTask } = this.state
    return (
      <div className="App">
        <Container>
          <Grid celled>
            <Grid.Row columns={3}>
              <Grid.Column> <Metric metric={outOfMilk ? 'EMPTY' : 'FULL'} label="Status" /> </Grid.Column>
              <Grid.Column> <Metric metric={`${coinBalance} Coins`} label="Balance" /> </Grid.Column>
              <Grid.Column> <Metric metric="4 Days" label="Age" /> </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column> <Task nextTask={nextTask} /> </Grid.Column>
              <Grid.Column> <Log logs={[]} /> </Grid.Column>
            </Grid.Row>

          </Grid>
        </Container>
      </div>
    );
  }
}

export default Main
