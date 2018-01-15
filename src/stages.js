import {
  verifyMilkOutage,
  verifyGotMilk,
  recordGotMilk,
  recordMilkOutage
} from './api'

export const stages = [
 {
   index: 0,
   key: 'MilkInFullSupply',
   title: 'Record Outage',
   icon: 'alarm',
   task: {
    title: 'Record Milk Outage',
    reward: '1 BDC',
    description: 'Record milk outage',
    action: (args) => recordMilkOutage(args)
   }
 },
 {
   index: 1,
   key: 'MilkOutageUnverified',
   title: 'Verify Outage',
   icon: 'checkmark',
   description: '',
   task: {
    title: 'Verify Milk Outage',
    reward: '1 BDC',
    description: 'Verify milk outage',
    action: (args) => verifyMilkOutage(args)
   }
 },
 {
   index: 2,
   key: 'AwaitingMilkPurchase',
   title: 'Purchase Milk',
   icon: 'cart',
   description: '',
   task: {
    title: 'Record Milk Purchase',
    action_description: '',
    action: (args) => recordGotMilk(args),
    reward: '12 BDC',
    description: 'Record the barcode of the milk you purchased',
    requiresInput: true
   }
 },
 {
   index: 3,
   key: 'MilkPurchasedUnverified',
   icon: 'checkmark',
   title: 'Verify Milk',
   description: '',
   task: {
    title: 'Verify Milk Purchase',
    reward: '1 BDC',
    description: 'Verify the barcode of the milk in the fridge',
    requiresInput: true,
    action: (args) => verifyGotMilk(args)
   }
 }
]
