import Web3 from 'web3'

const getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('pageshow', function() {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      results = {
        web3: web3
      }
      console.log('Injected web3 detected.', web3);
    }
    else {
      // Fallback to localhost if no web3 injection.
      const provider = new Web3.providers.HttpProvider('http://174.138.63.10:8545')
      web3 = new Web3(provider)
      results = {
        web3: web3
      }
      console.log('No web3 instance injected, using Local web3.');
    }
    resolve(results)
  })
})

export default getWeb3
