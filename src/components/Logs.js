import React from 'react';
import { Label, Segment } from 'semantic-ui-react'

const LogMessage = (props) => {
  const {e, i} = props;
  return (
    <div key={i}> {`${new Date().toLocaleTimeString()}: ${e.user.first_name} ${e.message}`}</div>
  )
}

export const LogsAlt = (props) => (
  <Segment.Group>
    <style jsx>{`
      .messages {
        font-family: monospace;
        text-transform: uppercase;
      }
    `}</style>
    <Segment> Event Log <Label circular> {props.logs.length}</Label> </Segment>
    <Segment secondary className='messages'>
      {props.logs.map((e, i) => <LogMessage e={e} i={i} />)}
    </Segment>
  </Segment.Group>
)
