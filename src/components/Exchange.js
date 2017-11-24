import React from 'react'
import ExchangeRateTable from './ExchangeRateTable'
import ExchangeFundsForm from './ExchangeForm'

const Exchange = (props) => (
  <div className='exchange'>
    <style jsx>{`
      .exchange {
        padding-top: 0px;
      }
    `}</style>
      <ExchangeRateTable />
      <ExchangeFundsForm user={props.user} />
  </div>
)

export default Exchange
