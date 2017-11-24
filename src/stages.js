import React from 'react'
import {
  verifyMilkOutage,
  verifyGotMilk,
  recordGotMilk,
  recordMilkOutage,
  voteForMilk
} from './api'

import { Grid, Dropdown, Button} from 'semantic-ui-react'

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
   key: 'VotingOnMilkOpen',
   title: 'Vote',
   icon: 'comments outline',
   description: '',
   task: {
    title: 'Vote On Milk',
    reward: '0 BDC',
    description: 'Vote On Milk',
    requiresInput: true,
    InputComponent: (props) =>
    <Grid>
    <Grid.Row>
      <Grid.Column width={10}>
      <Dropdown action='Vote' button basic fluid defaultValue='almond' options={[
        {text: 'Almond Milk', value: 'almond'},
        {text: 'Soy Milk', value: 'soy'},
        {text: 'Whole Milk', value: 'whole'},
        {text: '2% Milk', value: 'two'},
        {text: 'Skim Milk', value: 'skim'}
      ]} {...props} />
      </Grid.Column>
      <Grid.Column>
      <Button basic color='green'> VOTE </Button>
    </Grid.Column>
    </Grid.Row>
    </Grid>,
    action: (args) => voteForMilk(args)
   }
 },
 {
   index: 3,
   key: 'AwaitingMilkPurchase',
   title: 'Purchase Milk',
   icon: 'cart',
   description: '',
   task: {
    title: 'Record Milk Purchase',
    action_description: '',
    action: (args) => { console.log(args); recordGotMilk(args) },
    reward: '10 BDC',
    description: 'Record the barcode of the milk you purchased',
    requiresInput: true
   }
 },
 {
   index: 4,
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
