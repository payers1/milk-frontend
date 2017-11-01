import React from 'react'
import { storiesOf } from '@storybook/react'
import { host } from 'storybook-host'
import {Log, Task} from '.'
import ExchangeTable from './Exchange'
import '../App.css';
import 'semantic-ui-css/semantic.min.css';

const mockLogs = [{
  id: '1',
  block_number: 1,
  user: {first_name: 'bob'},
  message: 'recorded a milk outage'
}, {
  id: '2',
  block_number: 1,
  user: {first_name: 'alice'},
  message: 'verified milk outage'
}, {
  id: '3',
  block_number: 1,
  user: {first_name: 'carl'},
  message: 'bought milk'
}]

const sampleTask = {
  action: '',
  title: 'Record Milk Outage',
  description: 'Go to the kitchen, verify that there is no milk'
}

storiesOf('Exchange Table', module)
  .addDecorator(host({
    title: 'Title',
    align: 'center middle',
    backdrop: '#F4F7FA'
  }))
  .add('base', () => {
    return  (
      <div>
        <ExchangeTable />
      </div>
    )
  })

storiesOf('Logs', module)
  .addDecorator(host({
    title: 'Title',
    align: 'center middle',
    width: '100%',
    backdrop: '#F4F7FA'
  }))
  .add('base', () => <Log logs={mockLogs} />)

storiesOf('Task', module)
  .addDecorator(host({
    title: 'Title',
    align: 'center middle',
    width: '40%',
    backdrop: '#F4F7FA'
  }))
  .add('base', () => <Task nextTask={sampleTask}/>)
