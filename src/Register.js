import React from 'react'
import { registerUser } from './api';
import { compose, withState, withHandlers } from 'recompose'
import { Button, Form } from 'semantic-ui-react'

const enhance = compose(
  withState('state', 'setState', {}),
  withHandlers({
    onChange: props => event => {
      props.setState({
        ...props.state,
        [event.target.name]: event.target.value
      })
    },
    onSubmit: props => event => {
      event.preventDefault()
      registerUser()
    }
  })
)

const Register = ({onSubmit, onChange, account}) => (
  <div className='register-form'>
    <Form onSubmit={onSubmit}>
      <Form.Input name='first_name' onChange={onChange} label='First name' placeholder='First Name' />
      <Form.Input name='email' onChange={onChange} label='email' placeholder='Email' />
      <Form.Input label='Account' readOnly value={account} />
      <Button type='submit'>REGISTER</Button>
    </Form>
  </div>
)

export default enhance(Register)
