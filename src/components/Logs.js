import React from 'react';
import { Label, Segment } from 'semantic-ui-react'

const withKeyFromProps = (Comp, propName) => (props) => <Comp key={props[propName]} {...props} />

const LogMessage = ({user, message}) => (
  <div> {`${new Date().toLocaleTimeString()}: ${user.first_name} ${message}`}</div>
)

const LogMessageDisplay = withKeyFromProps(LogMessage, 'i');

export const LogsAlt = ({logs}) => (
  <Segment.Group>
    <style jsx>{`
      .messages {
        font-family: monospace;
        text-transform: uppercase;
      }
    `}</style>
    <Segment> Event Log <Label circular> {logs.length}</Label> </Segment>
    <Segment secondary className='messages'>
      {logs.map(LogMessageDisplay)}
    </Segment>
  </Segment.Group>
)
