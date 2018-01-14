import React from 'react'
import uport from './utils/getUport'
import Cookie from 'js-cookie';
import { handleUportLogin } from './api'

const qs = require('qs');
const mnid = require('mnid')

const withUport = (Component) => class extends React.Component {
  state = { uport: null }
  async componentDidMount() {
    const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    const uportCreds = Cookie.get('uport_creds') && JSON.parse(Cookie.get('uport_creds'));
    if (window.location.hash) {
      const hash = qs.parse(window.location.hash.slice(1));
      const accessToken = hash.access_token;
      accessToken && uport.credentials.receive(accessToken)
                       .then(creds => {
                          handleUportLogin(creds)
                          uport.address = creds.address
                          uport.publicEncKey = creds.publicEncKey
                          uport.pushToken = creds.pushToken
                          Cookie.set('uport_creds', creds, {expires: inFifteenMinutes})
                          this.setState({loading: false, uport, name: creds.name})
                       })
    }
    else if (uportCreds) {
      uport.address = uportCreds.address
      uport.publicEncKey = uportCreds.publicEncKey
      uport.pushToken = uportCreds.pushToken
      this.setState({loading: false, uport, name: uportCreds.name})
    }
    else {
      return uport.requestCredentials({ requested: ['name', 'email'], notifications: true })
        .then(creds => {
          handleUportLogin(creds)
          Cookie.set('uport_creds', creds, {expires: inFifteenMinutes})
          this.setState({loading: false, uport, name: creds.name})
        })
    }
  }

  render() {
    const { uport, name } = this.state
    const appReady = uport
    if (!appReady) {
      return <div>Loading uport </div>
    }
    const decoded = mnid.decode(uport.address);

    return <Component
      uport={uport}
      name={name}
      uPortAccount={decoded.address}
      {...this.props}
    />
  }
}

export default withUport
