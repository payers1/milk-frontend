import React from 'react'
import { Table, Segment } from 'semantic-ui-react'
import { getSellPrices } from '../api'
const { lifecycle } = require('recompose');

const withData = lifecycle({
  state: { loading: true, exchangeRates: {USD: {}, LTC: {}, ETH: {}, BTC: {}} },
  async componentDidMount() {
    const prices = await getSellPrices();
    this.setState({exchangeRates: {...prices}, loading: false})
  }
})

const TableHeader = () => (
  <Table.Header>
    <Table.Row>
    <Table.HeaderCell></Table.HeaderCell>
    <Table.HeaderCell width={6}>BDC</Table.HeaderCell>
    <Table.HeaderCell width={6}>USD</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
)

const CurrencyRow = ({symbol, exchangeRate, price}) => (
  <Table.Row>
    <Table.Cell> {symbol} </Table.Cell>
    <Table.Cell> {exchangeRate} </Table.Cell>
    <Table.Cell> {price} </Table.Cell>
  </Table.Row>
)

const ExchangeRateTable = (props) => (
  <Segment basic loading={props.loading}>
    <Table celled>
      <TableHeader />
      <Table.Body>
        {Object.keys(props.exchangeRates)
               .map((currencySymbol) => (
                 <CurrencyRow
                    key={currencySymbol}
                    exchangeRate={props.exchangeRates[currencySymbol].rate}
                    price={props.exchangeRates[currencySymbol].amount}
                    symbol={currencySymbol} />))}
      </Table.Body>
    </Table>
  </Segment>
)

export default withData(ExchangeRateTable)
