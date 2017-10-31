import React from 'react';
import { Button } from 'semantic-ui-react'

const Task = (props) => {
  return (
    <div className="tasks">
      <Button
        content={props.nextTask.title}
        onClick={props.nextTask.action} />
      <div> <strong>Reward: </strong>1 Coin </div>
    </div>
  )
}

export default Task;
