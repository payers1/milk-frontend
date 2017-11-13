import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import uport from './utils/getUport'
import { handleUportLogin } from './api'
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { withProps } from 'recompose'

import Main from './Main';
import { Nav } from './components'
import { Container } from 'semantic-ui-react'

const Loading = () => <h1>...</h1>
const NotAuthorized = () => (<h1>Sorry you're not authorized</h1>)

class App extends Component {
  state = {
    loading: true,
    account: null,
    uport: {},
    name: '',
    authorized: false
  }

  componentDidMount() {
    return getWeb3
      .then(({web3}) => {
        this.setState({ web3, uport })
        return uport.requestCredentials({ requested: ['name', 'email'], notifications: true })
      })
      .then((uportCredentials) => handleUportLogin(uportCredentials))
      .then(({ account_address: account, authorized, name }) => {
        this.setState({ name, account, authorized, loading: false })
      })
  }

  render() {
    const {
      authorized,
      loading,
      account,
      uport,
      name,
      web3
    } = this.state;

    const MainWithProps = withProps({ account, uport, web3 })(Main)

    const App = () => (
      <div className='App'>
        <Nav name={name} />
        <Container>
          <MainWithProps />
        </Container>
      </div>
    )

    if (loading) { return <Loading />}
    else if (!authorized) { return <NotAuthorized /> }
    else { return <App /> }
  }
}

export default App
