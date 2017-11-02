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
    contractAsync.stageAsync()
  ])
  .spread((outOfMilk, milkOutageVerified, notifier, verifier, coin2, stage) => {
    return {
      outOfMilk,
      milkOutageVerified,
      coinBalance: coin2.toString(),
      stage: STAGES[stage.toString()]
    }
  })
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
