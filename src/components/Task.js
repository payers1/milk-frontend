import React from 'react';
import { Button, Card, Input, Form } from 'semantic-ui-react'
import { compose, withState, withHandlers } from 'recompose'

const enhance = compose(
  withState('state', 'setState', undefined),
  withState('loading', 'setLoading', false),
  withHandlers({
    onChange: props => (event, data) => props.setState(data.value),
    onSubmit: props => async event => {
      props.setLoading(true)
      event.preventDefault()
      const actionArgs = {
        arg: props.state,
        web3: props.web3,
        contract: props.contract
      }
      const action = props.nextTask.action.bind(null, actionArgs)
      await action()
      props.setLoading(false)
    }
  })
)

const ActionDisplay = ({nextTask, onSubmit, onChange, state, loading, contract, web3}) => {
  if (nextTask.requiresInput && !nextTask.InputComponent) {
    return <Form onSubmit={onSubmit}>
      <Input fluid
        type="number"
        loading={loading}
        disabled={loading}
        onChange={onChange}
        value={state}
        placeholder='Enter Milk Barcode'
        action='Submit' />
    </Form>
  } else if (nextTask.requiresInput && nextTask.InputComponent) {
    return <Form onSubmit={onSubmit}>
      <nextTask.InputComponent
        loading={loading}
        disabled={loading}
        onChange={onChange} />
    </Form>
  }
  return (
    <Button fluid inverted color='green' loading={loading} content='Submit' onClick={onSubmit} />
  )
}

const Action = enhance(ActionDisplay)

const Task = ({nextTask, web3, contract, admin, userRole}) => (
  <Card fluid>
    <Card.Content>
      <Card.Header> {nextTask.title} </Card.Header>
      <Card.Meta> {nextTask.reward} </Card.Meta>
      <Card.Description> {nextTask.description} </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Action nextTask={nextTask} contract={contract} web3={web3} />
    </Card.Content>
  </Card>
)

export default Task;
