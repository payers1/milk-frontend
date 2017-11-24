import React from 'react'
import './App.css';
import withUport from './withUport'
import 'semantic-ui-css/semantic.min.css';

import Main from './Main';
import { Nav } from './components'
import { Container } from 'semantic-ui-react'

const App = (props) => (
  <div className='App'>
    <Nav name={props.name} />
    <Container>
      <Main
        uport={props.uport}
        uPortAccount={props.uPortAccount}
      />
    </Container>
  </div>
)
export default withUport(App)
