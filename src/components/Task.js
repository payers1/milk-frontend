import React from 'react';
import { Button, Card } from 'semantic-ui-react'

const Task = (props) => {
  return (
    <div className="tasks">
      <style jsx>{`
        .tasks {}
      `}</style>
      <Card>
        <Card.Content>
          <Card.Header> {props.nextTask.title} </Card.Header>
          <Card.Meta> 1 COIN </Card.Meta>
          <Card.Description> {props.nextTask.description} </Card.Description>
        </Card.Content>
         <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green' onClick={props.nextTask.action}> Approve</Button>
        </div>
      </Card.Content>
      </Card>
    </div>
  )
}

export default Task;
