import React, { Component } from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
import { getSellPrices, exchange } from '../api'

const options = ['USD', 'ETH', 'LTC', 'BTC']
const selectOptions = options.map(opt => ({key: opt, text: opt, value: opt}))

class ExchangeFundsForm extends Component {
  state = {
    submitted: false,
    amountToSell: 0,
    desiredCurrency: 'USD',
    exchangeRates: {
      USD: {},
      LTC: {},
      ETH: {},
      BTC: {}
    }
  }

  async componentDidMount() {
    const prices = await getSellPrices();
    this.setState({exchangeRates: {...prices}})
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
    const exchangeRate = this.state.exchangeRates[this.state.desiredCurrency]
    if (exchangeRate) {
      const n = this.state.amountToSell * exchangeRate.rate
      return n
    }
    return 0;
  }

  onSubmit = (e) => {
    const { user } = this.props
    const { desiredCurrency, amountToSell, accountNumber } = this.state
    e.preventDefault()
    return exchange({desiredCurrency, amountToSell, accountNumber, user}).then(r => {
      if (r.ok) {
        this.setState({
          submitted: true,
          success: true
        })
      }
    })
  }

  render() {
    return <Form success={this.state.success} onSubmit={this.onSubmit} onChange={this.onChange}>
          <Message
      success
      header='Form Completed'
      content="You'll get an email when the transaction has completed."
    />
      <Form.Select
        disabled={this.state.submitted}
        button basic
        required
        name="desiredCurrency"
        onChange={this.handleSelect}
        label='Desired Currency'
        defaultValue='USD'
        options={selectOptions} />
      <Form.Group widths='equal'>
        <Form.Input
          required
          disabled={this.state.submitted}
          name="amountToSell"
          type="number"
          max="100"
          label='# of BDC to sell'/>

        <Form.Input
          disabled={this.state.submitted}
          required={this.state.desiredCurrency !== 'USD'}
          name="accountNumber"
          label='Deposit to'
          placeholder='Enter account #' />
      </Form.Group>
        <Segment textAlign='center'> {this.state.amountToSell} BDC = {this.getNumber()} {this.state.desiredCurrency} </Segment>
        <Button content='Submit' type='submit' />
    </Form>
  }
}

export default ExchangeFundsForm
