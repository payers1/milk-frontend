import React from 'react';
import { Button, Card, Input } from 'semantic-ui-react'

const Action = ({nextTask}) => {
  if (nextTask.requiresInput) {
    return <Input placeholder='Enter Milk Barcode' action='Submit' />
  }
  return (
    <div className='ui two buttons'>
      <Button basic color='green' onClick={nextTask.action}> Approve </Button>
    </div>
  )
}

const Task = ({nextTask}) => (
  <Card fluid>
    <Card.Content>
      <Card.Header> {nextTask.title} </Card.Header>
      <Card.Meta> 1 COIN </Card.Meta>
      <Card.Description> {nextTask.description} </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Action nextTask={nextTask} />
    </Card.Content>
  </Card>
)

export default Task;
