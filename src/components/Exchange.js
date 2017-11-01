import React from 'react'
import { Table, Button, Input, Dropdown, Form } from 'semantic-ui-react'
const { format } = require('d3-format')

const Exchange = () => {
  const usd = 1.00
  const eth = 297.53
  const ltc = 56.07
  const btc = 5964.99

const getExchange = (rate) => {
  return 1 / ((rate + 2.00) * 4)
}

const formatCents = (inCents) => format("18")(inCents)

const getUsdExchange = () => usd / 4
const getEthExchange = () => formatCents(getExchange(eth))
const getLtcExchange = () => formatCents(getExchange(ltc))
const getBtcExchange = () => formatCents(getExchange(btc))

const currencies = [{
  currency: 'USD',
  getExchange: getUsdExchange()
}, {
  currency: 'ETH',
  getExchange: getEthExchange()
}, {
  currency: 'LTC',
  getExchange: getLtcExchange()
}, {
  currency: 'BTC',
  getExchange: getBtcExchange()
}]

const options = [{
  key: 'USD',
  text: 'USD',
  value: 'USD'
}, {
  key: 'ETH',
  text: 'ETH',
  value: 'ETH'
}, {
  key: 'LTC',
  text: 'LTC',
  value: 'LTC'
}]

const CurrencyRow = ({s}) => (
  <Table.Row>
    <Table.Cell> {s.currency} </Table.Cell>
    <Table.Cell> {s.getExchange} </Table.Cell>
  </Table.Row>
)

  return (
    <div>
      <style jsx>{``} </style>
      <h1> EXCHANGE RATES </h1>
      <Table celled>
        <Table.Header>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>1 BDC</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {currencies.map((s) => <CurrencyRow s={s} />)}
        </Table.Body>
      </Table>
      <Form>
        <Form.Group widths='equal'>
          <Form.Input label='# OF COINS TO SELL:'/>
          <Form.Input label='Acct #:' placeholder='Enter account #' />
          <Form.Select label='Desired Currency' button basic defaultValue='USD' options={options}/>
        </Form.Group>

        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  )
}

export default Exchange
