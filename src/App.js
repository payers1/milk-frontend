import React from 'react'
import './App.css';
import withUport from './withUport'
import 'semantic-ui-css/semantic.min.css';

import Main from './Main';
import { Nav } from './components'
import { Container } from 'semantic-ui-react'

const App = ({name, uport, uPortAccount}) => (
  <div className='App'>
    <Nav name={name} />
    <Container content={ <Main uport={uport} uPortAccount={uPortAccount} /> } />
  </div>
)
export default withUport(App)
