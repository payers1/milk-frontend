import P from 'bluebird';
import { stages } from './stages';
import {
  recordMilkOutage,
  verifyMilkOutage,
  recordGotMilk,
  verifyGotMilk
} from './contract-api'

export const getContractValues = (account) => {
  return P.resolve(fetch(process.env.REACT_APP_API + `/contract-values?account=${account}`))
          .then((response) => response.json())
          .tap(console.log)
          .then(response => {
            response.stage = stages.find(s => s.index === response.stage)
            return response;
          })
          .catch(console.log)
}

export const getContract = () => fetch(process.env.REACT_APP_API + '/contract')
                                  .then((response) => response.json())

const getSellPrice = (currency) => {
  return fetch(`https://api.coinbase.com/v2/prices/${currency}-USD/sell`, {
    headers: { 'CB-VERSION': '2015-04-08' }
  })
  .then(response => response.json())
}

export const getSellPrices = () => {
  return P.all([
    getSellPrice('BTC'),
    getSellPrice('ETH'),
    getSellPrice('LTC')
  ])
  .reduce((prev, curr) => {
    const priceInUSD  = parseFloat(curr.data.amount)
    prev[curr.data.base] = {
      amount: priceInUSD,
      rate: 1 / ((priceInUSD + 2) * 4)
    }
    return prev;
  }, {'USD': {amount: 1, rate: 0.25}})
}

export const exchange = ({desiredCurrency, amountToSell, accountNumber, user}) => {
  return fetch(process.env.REACT_APP_API + '/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desiredCurrency,
      amountToSell,
      accountNumber,
      user
    })
  });
}

export const handleUportLogin = (creds) => {
  return fetch(process.env.REACT_APP_API + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  })
  .then(response => response.json())
  .catch(e => console.log('err', e))
}

export {
  recordMilkOutage,
  verifyMilkOutage,
  recordGotMilk,
  verifyGotMilk
}
