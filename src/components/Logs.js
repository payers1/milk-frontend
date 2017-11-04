import React from 'react';
import { Label, Segment } from 'semantic-ui-react'
import { getLogs } from '../api'
const { lifecycle } = require('recompose');

const withData = lifecycle({
  state: { loading: true, logs: []},
  async componentDidMount() {
    const logs = await getLogs(this.props.contract.address);
    this.setState({ logs, loading: false })
  }
})

const withKeyFromProps = (Comp, propName) => (props) => <Comp key={props[propName]} {...props} />

const LogMessage = ({user, message, created_at}) => (
  <div> {`${new Date(created_at).toLocaleTimeString()}: ${user.first_name} ${message}`}</div>
)

const LogMessageDisplay = withKeyFromProps(LogMessage, 'id');

export const Logs = ({logs, loading}) => (
  <Segment.Group >
    <Segment> Event Log <Label circular> {logs.length}</Label> </Segment>
    <Segment secondary >
      <div className='messages'>
        <style jsx>{`
          .messages{
            font-family: monospace;
            text-transform: uppercase;
          }
        `}
       </style>
        {logs.map(LogMessageDisplay)}
      </div>
    </Segment>
  </Segment.Group>
)

export default withData(Logs)
