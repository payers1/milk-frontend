import P from 'bluebird';

const logError = e => console.log(e)
const logComplete = (block, message) => console.log(block, message)
const isProd = process.env.NODE_ENV !== 'development'

const getTx = (txHash, web3) => {
  return P.promisify(web3.eth.getTransaction)(txHash)
    .then((b) => (
      !b.blockNumber ? P.delay(500).then(() => getTx(txHash, web3)): b
    ))
    .catch(logError)
}

async function doStuff(method, web3) {
  const [account] = await web3.eth.getAccounts()
  return method.send({from: account})
  .on('transactionHash', console.log)
  .on('confirmation', console.log)
  .on('receipt', console.log)
  .on('error', console.log)
}

export const recordMilkOutage = ({contract, web3}) => {
  if (!isProd) {
    return doStuff(contract.methods.recordMilkOutage(), web3)
  }
  return contract.recordMilkOutage()
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'recorded milk outage'))
    .catch(logError)
}

export const verifyMilkOutage = ({contract, web3}) => {
  if (!isProd) {
    return doStuff(contract.methods.verifyMilkOutage(), web3)
  }
  return contract.verifyMilkOutage()
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'verified milk outage'))
    .catch(logError)
}

export const recordGotMilk = ({contract, web3, arg}) => {
  if (!isProd) {
    return doStuff(contract.methods.recordGotMilk(arg), web3)
  }
  return contract.recordGotMilk(arg)
  .then(tx => getTx(tx, web3))
  .then(logComplete.bind(null, 'recorded milk purchased'))
  .catch(logError)
}

export const verifyGotMilk = ({contract, web3, arg}) => {
  if (!isProd) {
    return doStuff(contract.methods.verifyGotMilk(arg), web3)
  }
  return contract.verifyGotMilk(arg)
    .then(tx => getTx(tx, web3))
    .then(logComplete.bind(null, 'milk purchase verified'))
    .catch(logError)
}
