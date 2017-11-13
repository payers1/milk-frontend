import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('Blockchain Milk', {
  clientId: process.env.REACT_APP_CLIENT_ID,
  network: 'rinkeby',
  signer: SimpleSigner(process.env.REACT_APP_UPORT_SIGNING_KEY)
})

 export default uport
