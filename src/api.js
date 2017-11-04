import P from 'bluebird';

const logError = e => console.log(e)
const logComplete = (block, message) => console.log(block, message)

const STAGES = {
  0: 'MilkInFullSupply',
  1: 'MilkOutageUnverified',
  2: 'MilkOutageVerified',
  3: 'MilkPurchasedUnverified'
}

export const getAccounts = web3 => P.promisify(web3.eth.getAccounts)()

const getTx = (txHash, web3) => {
  return P.promisify(web3.eth.getTransaction)(txHash)
    .then((b) => {
      return !b.blockNumber ? P.delay(500).then(() => getTx(txHash, web3)): b;
    })
    .catch(logError)
}

export const recordMilkOutage = (account, contract, web3) => {
  return P.promisify(contract.recordMilkOutage)({from: account})
    .then((txHash) => getTx(txHash, web3))
    .then(logComplete.bind(null, 'recorded milk outage'))
    .catch(logError)
}

export const verifyMilkOutage = (account, contract, web3) => {
  return P.promisify(contract.verifyMilkOutage)({from: account})
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'verified milk outage'))
    .catch(logError)
}

export const recordGotMilk = (account, contract, web3, code) => {
  return P.promisify(contract.recordGotMilk)(code || 1, {from: account})
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'recorded milk purchased'))
    .catch(logError)
}

export const verifyGotMilk = (account, contract, web3, code) => {
  return P.promisify(contract.verifyGotMilk)(code || 1, {from: account})
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'milk purchase verified'))
    .catch(logError)
}

export const getContractValues = (contract, account, coin) => {
  const contractAsync = P.promisifyAll(contract);
  const coinAsync = P.promisify(coin.balanceOf);
  return P.all([
    contractAsync.outOfMilkAsync(),
    contractAsync.milkOutageVerifiedAsync(),
    contractAsync.milkOutageNotifierAsync(),
    contractAsync.milkOutageVerifierAsync(),
    coinAsync(account),
    contractAsync.stageAsync(),
    P.promisify(coin.totalSupply)()
  ])
  .spread((outOfMilk, milkOutageVerified, notifier, verifier, coin2, stage, totalSupply) => {
    return {
      outOfMilk,
      milkOutageVerified,
      coinBalance: coin2.toString(),
      stage: STAGES[stage.toString()],
      totalSupply: totalSupply.toString()
    }
  })
}

export const sendCoinFromBobToMilk = (coin, account, web3) => {
  return P.promisify(coin.transfer)("0xe17ef3c7a9082bb9f4b3f123003e9f3410df2917", 100, {from: account})
  .then(tx => getTx(tx, web3))
  .then(logComplete.bind(null, 'contract funded with coins'))
}

export const getContract = () => fetch(process.env.API + '/contract')
                                  .then((response) => response.json())

export const registerUser = (address, firstName, email) => {
  return fetch(process.env.API + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      firstName,
      email
    })
  });
}

export const burnToken = (coin, web3, account) => {
  return P.promisify(coin.burn)(1, {from: account})
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'coins burned'))
}

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
      rate: 1 / ((priceInUSD) * 4)
    }
    return prev;
  }, {'USD': {amount: 1, rate: 0.25}})
}

export const getLogs = (address) => {
  return fetch(process.env.API + `/logs?contract_address=${address}`)
    .then(response => response.json())
}

export const getLatestMilkVerifiedDate = (address) => {
  return fetch(process.env.API + `/latest-milk?contract_address=${address}`)
    .then(response => response.json())
}

export const exchange = ({desiredCurrency, amountToSell, accountNumber}) => {
  return fetch(process.env.API + '/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desiredCurrency,
      amountToSell,
      accountNumber
    })
  });
}
