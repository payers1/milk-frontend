import P from 'bluebird';

const logError = e => console.log(e)
const logComplete = (block, message) => console.log(block, message)

import { stages } from './stages';

const getTx = (txHash, web3) => {
  return P.promisify(web3.eth.getTransaction)(txHash)
    .then((b) => (
      !b.blockNumber ? P.delay(500).then(() => getTx(txHash, web3)): b
    ))
    .catch(logError)
}

export const recordMilkOutage = ({contract, web3}) => {
  return contract.recordMilkOutage()
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'recorded milk outage'))
    .catch(logError)
}

export const verifyMilkOutage = ({contract, web3}) => {
  return contract.verifyMilkOutage()
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'verified milk outage'))
    .catch(logError)
}

export const recordGotMilk = ({contract, web3, arg}) => {
  return contract.recordGotMilk(arg)
  .then(tx => getTx(tx, web3))
  .then(logComplete.bind(null, 'recorded milk purchased'))
  .catch(logError)
}

export const verifyGotMilk = ({contract, web3, arg}) => {
  return contract.verifyGotMilk(arg)
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'milk purchase verified'))
    .catch(logError)
}

export const voteForMilk = ({contract, web3, arg}) => {
  return contract.vote(arg)
  .then(tx => getTx(tx, web3))
  .then(logComplete.bind(null, 'voted for milk'))
  .catch(logError)
}

export const getContractValues = (account) => {
  return P.resolve(fetch(process.env.API + `/contract-values?account=${account}`))
          .then((response) => response.json())
          .tap(console.log)
          .then(response => {
            response.stage = stages.find(s => s.index === response.stage)
            return response;
          })
}

export const getContract = () => fetch(process.env.API + '/contract')
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
  return fetch(process.env.API + '/exchange', {
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
  return fetch(process.env.API + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  })
  .then(response => response.json())
  .catch(e => console.log('err', e))
}
