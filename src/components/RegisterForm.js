import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import 'semantic-ui-css/components/form.css';
import 'semantic-ui-css/components/input.css';
import 'semantic-ui-css/components/button.css';

const RegisterForm = ({onSubmit, onChange, account}) => (
  <Form onSubmit={onSubmit}>
    <Form.Input name='first_name' onChange={onChange} label='First name' placeholder='First Name' />
    <Form.Input name='email' onChange={onChange} label='email' placeholder='Email' />
    <Form.Input label='Account' readOnly value={account} />
    <Button type='submit'>REGISTER</Button>
  </Form>
)

export default RegisterForm
