import React from 'react';
import { Button, Card, Input, Form } from 'semantic-ui-react'
import { compose, withState, withHandlers } from 'recompose'

const enhance = compose(
  withState('barcode', 'setBarcode', undefined),
  withState('loading', 'setLoading', false),
  withHandlers({
    onChange: props => event => {
      props.setBarcode(event.target.value)
    },
    onSubmit: props => async event => {
      props.setLoading(true)
      event.preventDefault()
      await props.nextTask.action.bind(null, props.barcode)()
      props.setLoading(false)
      props.setBarcode('')
    }
  })
)

const ActionDisplay = ({nextTask, onSubmit, onChange, barcode, loading}) => {
  if (nextTask.requiresInput) {
    return <Form onSubmit={onSubmit}>
      <Input fluid
        type="number"
        loading={loading}
        disabled={loading}
        onChange={onChange}
        value={barcode}
        placeholder='Enter Milk Barcode'
        action='Submit' />
    </Form>
  }
  return (
    <div className='ui two buttons'>
      <Button basic color='green' onClick={nextTask.action}> Submit </Button>
    </div>
  )
}

const Action = enhance(ActionDisplay)

const Task = ({nextTask}) => (
  <Card fluid>
    <Card.Content>
      <Card.Header> {nextTask.title} </Card.Header>
      <Card.Meta> {nextTask.title} </Card.Meta>
      <Card.Description> {nextTask.description} </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Action nextTask={nextTask} />
    </Card.Content>
  </Card>
)

export default Task;
