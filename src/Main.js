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
  getContractValues,
  sendCoinFromBobToMilk,
  burnToken,
  getLatestMilkVerifiedDate
} from './api';

import { Grid, Container, Button } from 'semantic-ui-react'
import moment from 'moment'

class Main extends Component {
  state = {
    nextTask: {}
  }

  componentDidMount() {
    this.getContractValues()
    this.setupWatchers()
  }

  getContractValues = async () => {
    const vals = await getContractValues(this.props.contract, this.props.account, this.props.coin)
    this.setState(vals);
    this.getNextTask();
    this.getLatestMilkVerifiedDate()
  }

  setupWatchers = () => {
    const { web3, contract, account, coin } = this.props
    web3.eth.filter('latest')
            .watch((error, result) => this.getContractValues(contract, account))

    contract.allEvents().watch((err, evt) => console.log('all events', err, evt));
    coin.allEvents().watch((err, evt) => console.log('coin events', err, evt));
  }

  getLatestMilkVerifiedDate() {
    getLatestMilkVerifiedDate(this.props.contract.address)
    .then(latestDate => {
      this.setState({
        diff: moment().diff(latestDate, 'days', true).toFixed(2)
      })
    })
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
          requiresInput: true,
          action: recordGotMilk.bind(null, account, contract, web3, unverifiedMilkBarCode)
        }
      break;

      case 'MilkPurchasedUnverified':
        nextTask = {
          title: 'VERIFY MILK',
          requiresInput: true,
          action: verifyGotMilk.bind(null, account, contract, web3, verifiedMilkBarCode)
        }
      break;
      default:
    }

    this.setState({
      nextTask
    })
  }

  fundContract = () => sendCoinFromBobToMilk(this.props.coin, this.props.account, this.props.web3)

  burn = () => burnToken(this.props.coin, this.props.web3, this.props.account)

  render() {
    const { outOfMilk, coinBalance, nextTask } = this.state
    return (
      <div className="App">
        <Container>
          <Grid celled>
            <Grid.Row columns={3}>
              <Grid.Column> <Metric metric={outOfMilk ? 'EMPTY' : 'FULL'} label="Milk Status" /> </Grid.Column>
              <Grid.Column> <Metric metric={`${coinBalance} Coins`} label="Balance" /> </Grid.Column>
              <Grid.Column> <Metric metric={`${this.state.diff} Days`} label="Age" /> </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={3}>
              <Grid.Column> <Task nextTask={nextTask} /> </Grid.Column>
              <Grid.Column> <Log contract={this.props.contract} /> </Grid.Column>
              <Grid.Column> <Button onClick={this.fundContract}> Transfer Coins to Contract </Button> </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column> <Metric metric={this.state.totalSupply} label="Token Supply" /> </Grid.Column>
              <Grid.Column> <Button onClick={this.burn}> Burn </Button> </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Main
