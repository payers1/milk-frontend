import React from 'react'
import ExchangeRateTable from './ExchangeRateTable'
import ExchangeFundsForm from './ExchangeForm'

const Exchange = () => (
  <div className='exchange'>
    <style jsx>{`
      .exchange {
        padding-top: 0px;
      }
    `}</style>
      <ExchangeRateTable />
      <ExchangeFundsForm />
  </div>
)

export default Exchange
