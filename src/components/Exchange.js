import React from 'react'
import ExchangeRateTable from './ExchangeRateTable'
import ExchangeFundsForm from './ExchangeForm'

const Exchange = ({user}) => (
  <div>
    <ExchangeRateTable />
    <ExchangeFundsForm user={user} />
  </div>
)

export default Exchange
