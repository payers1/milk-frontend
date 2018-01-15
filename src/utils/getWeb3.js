import Web3 from 'web3'

const getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('pageshow', function() {
    var web3 = new Web3(window.web3.currentProvider)
    resolve({ web3 })
  })
})

export default getWeb3
