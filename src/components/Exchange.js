import React, { Component } from 'react'
import { Table, Button, Form, Segment } from 'semantic-ui-react'
import { getSellPrice } from '../api'
import P from 'bluebird'

const options = ['USD', 'ETH', 'LTC', 'BTC']

const selectOptions = options.map(opt => ({key: opt, text: opt, value: opt}))

const CurrencyRow = ({symbol, exchangeRate, price}) => (
  <Table.Row>
    <Table.Cell> {symbol} </Table.Cell>
    <Table.Cell> {exchangeRate} </Table.Cell>
    <Table.Cell> {price} </Table.Cell>
  </Table.Row>
)

class Exchange extends Component {

  state = {
    USD: 1,
    ETH: 1,
    LTC: 1,
    BTC: 1,
    amountToSell: 0,
    desiredCurrency: 'USD'
  }

  componentWillMount() {
    return P.all([
      getSellPrice('BTC'),
      getSellPrice('ETH'),
      getSellPrice('LTC')
    ])
    .map((response) => response.json())
    .each(({data}) => this.setState({ [data.base]: (parseFloat(data.amount)) }))
  }

  getExchangeForCurrency = (symbol) => {
    if (symbol === 'USD') {
      return 0.25
    }
    const price = this.state[symbol]
    return 1 / ((price) * 4)
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelect = (event, data) => {
    this.setState({
      desiredCurrency: data.value
    })
  }

  getNumber = () => {
    const n = this.state.amountToSell * this.getExchangeForCurrency(this.state.desiredCurrency)
    return n
  }

  render() {
    return (
    <div>
      <h1> EXCHANGE RATES </h1>
      <Table celled>
        <Table.Header>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell width={6}>1 BDC</Table.HeaderCell>
          <Table.HeaderCell width={6}>1 USD</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {options.map((currencySymbol) => <CurrencyRow
            key={currencySymbol}
            exchangeRate={this.getExchangeForCurrency(currencySymbol)}
            price={this.state[currencySymbol]}
            symbol={currencySymbol} />)}
        </Table.Body>
      </Table>
      <Form onChange={this.onChange}>
        <Form.Group widths='equal'>
          <Form.Input name="amountToSell" type="number" max="100" label='# of BDC to sell'/>
          <Form.Select name="desiredCurrency" onChange={this.handleSelect} label='Desired Currency' button basic defaultValue='USD' options={selectOptions}/>
          <Form.Input name="accountNumber" label='Deposit to' placeholder='Enter account #' />
        </Form.Group>
        <Segment padded textAlign='center'> {this.state.amountToSell} BDC = {this.getNumber()} {this.state.desiredCurrency} </Segment>
        <Button type='submit'>Submit</Button>

      </Form>
    </div>
  )
}}

export default Exchange
