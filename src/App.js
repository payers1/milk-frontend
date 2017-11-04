import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import {getAccounts, getContract} from './api'
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import P from 'bluebird'
import { withProps } from 'recompose'

import Main from './Main';
import Register from './Register';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={props => auth ? <Component {...props} {...rest} /> : <Redirect to='/register'/>} />
)
const Loading = () => <h1>Loading...</h1>

class App extends Component {
    state = {
      loading: true,
      userAuth: false,
      account: null,
      web3: {}
    }

  componentDidMount() {
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
    const {
      loading, userAuth, account, web3, coinContract: coin, milkContract: contract
    } = this.state;
    const MainWithProps = withProps(() => ({ account, web3, coin, contract }))(Main)
    const RegisterRouteComponent = () => userAuth ? <Redirect to='/dashboard' />
                                                  : <Register account={account} />
    const RootRouteComponent = () => <Redirect to='/dashboard' />
    const Routes = () => (
      <Router>
        <div>
          <PrivateRoute exact path="/" component={RootRouteComponent} auth={userAuth} />
          <Route path="/register" component={RegisterRouteComponent} />
          <PrivateRoute path="/dashboard" component={MainWithProps} auth={userAuth} />
        </div>
      </Router>
    )
    return loading ? <Loading /> : <Routes />
  }
}

export default App
